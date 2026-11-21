import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import { AnimationChannel, AnimationClip } from '../../animation/animation-clip';
import { MeshData } from '../../core/mesh';
import { ModelData, ModelImage, ModelMaterial, ModelNode, ModelSkin, SkinnedMeshData } from '../../core/model/model-data';
import { FbxNode, FbxProp, fbxChild, fbxValue, readFbx } from './fbx-reader';

/** FBX time unit: ticks per second. */
const TICKS_PER_SECOND = 46186158000;

interface FbxObject {
  id: number;
  name: string;
  /** The node name: Model, Geometry, Deformer, Material, Texture, Video, AnimationCurve... */
  kind: string;
  /** The subtype: Mesh, LimbNode, Null, Skin, Cluster... */
  type: string;
  node: FbxNode;
}

interface Connection {
  type: string;
  child: number;
  parent: number;
  property?: string;
}

export interface FbxParseOptions {
  /** Frames per second animations are resampled at. Default 30. */
  fps?: number;
}

/**
 * Reads a binary FBX 7.x file, as exported by Mixamo, Blender or Maya, into
 * a ModelData: the node hierarchy, meshes with skin weights, bones with
 * their inverse bind matrices, materials, embedded textures and animations.
 *
 * Supported: polygons (triangulated), normals and UVs by polygon vertex or
 * by control point, one skin per mesh, Lcl/Pre/Post rotations with any
 * Euler order. Animations are resampled at a fixed frame rate into LINEAR
 * clips. Not supported: rotation/scaling pivots and offsets, geometric
 * transforms, blend shapes.
 */
export async function parseFbx(buffer: ArrayBuffer, options: FbxParseOptions = {}): Promise<ModelData> {
  const { nodes } = await readFbx(buffer);
  return new FbxConverter(nodes, options.fps ?? 30).convert();
}

class FbxConverter {
  private readonly objects = new Map<number, FbxObject>();
  private readonly connections: Connection[] = [];
  private readonly nodeIndexById = new Map<number, number>();
  private readonly model: ModelData = { nodes: [], meshes: [], skins: [], clips: [], materials: [], images: [], unitScale: 0.01 };
  private readonly imageIndexById = new Map<number, number>();
  private readonly materialIndexById = new Map<number, number>();

  constructor(private readonly root: FbxNode[], private readonly fps: number) {}

  convert(): ModelData {
    this.readSettings();
    for (const node of this.root.find((n) => n.name === 'Objects')?.children ?? []) {
      const [id, fullName, type] = node.props as [number, string, string];
      this.objects.set(id, { id, name: cleanName(fullName), kind: node.name, type: type ?? '', node });
    }
    for (const c of this.root.find((n) => n.name === 'Connections')?.children ?? []) {
      const [type, child, parent, property] = c.props as [string, number, number, string?];
      this.connections.push({ type, child, parent, property });
    }
    this.readNodes();
    this.readMeshes();
    this.readAnimations();
    return this.model;
  }

  private readSettings(): void {
    const settings = props70(this.root.find((n) => n.name === 'GlobalSettings'));
    const unit = settings.get('UnitScaleFactor')?.[0];
    // UnitScaleFactor is in centimetres: 1 means cm, 100 means m.
    if (typeof unit === 'number' && unit > 0) this.model.unitScale = unit / 100;
    const up = settings.get('UpAxis')?.[0];
    if (typeof up === 'number' && up !== 1) {
      console.warn(`FBX: up axis ${'XYZ'[up]} is not converted; the model may lie on its side.`);
    }
  }

  // --- Hierarchy -----------------------------------------------------------

  private readNodes(): void {
    const models = [...this.objects.values()].filter((o) => o.kind === 'Model');
    const modelIds = new Set(models.map((m) => m.id));
    const parentOf = new Map<number, number>();
    for (const c of this.connections) {
      if (c.type === 'OO' && modelIds.has(c.child) && modelIds.has(c.parent)) parentOf.set(c.child, c.parent);
    }
    // Parents before children, so a node's parent index is always known.
    const visit = (model: FbxObject) => {
      if (this.nodeIndexById.has(model.id)) return;
      const parentId = parentOf.get(model.id);
      if (parentId !== undefined) visit(this.objects.get(parentId)!);
      const parent = parentId !== undefined ? this.nodeIndexById.get(parentId)! : -1;
      this.nodeIndexById.set(model.id, this.model.nodes.length);
      this.model.nodes.push({ name: model.name, parent, ...localTransform(model.node) });
    };
    models.forEach(visit);
  }

  // --- Meshes, skins, materials ------------------------------------------

  private readMeshes(): void {
    for (const model of this.objects.values()) {
      if (model.kind !== 'Model' || model.type !== 'Mesh') continue;
      const geometry = this.childrenOf(model.id).find((o) => o.kind === 'Geometry');
      if (!geometry) continue;
      const node = this.model.nodes[this.nodeIndexById.get(model.id)!];
      const skinDeformer = this.childrenOf(geometry.id).find((o) => o.kind === 'Deformer' && o.type === 'Skin');
      const clusters = skinDeformer
        ? this.childrenOf(skinDeformer.id).filter((o) => o.kind === 'Deformer' && o.type === 'Cluster')
        : [];

      const mesh = buildMesh(geometry.node, clusters.map((c) => c.node));
      node.mesh = this.model.meshes.length;
      this.model.meshes.push(mesh);

      if (clusters.length) {
        const skin: ModelSkin = { joints: [], inverseBindMatrices: [] };
        const meshAtBind = this.bindPose().get(model.id) ?? this.globalMatrix(this.nodeIndexById.get(model.id)!);
        for (const cluster of clusters) {
          const bone = this.childrenOf(cluster.id).find((o) => o.kind === 'Model');
          skin.joints.push(bone ? this.nodeIndexById.get(bone.id)! : 0);
          // TransformLink is the bone's global matrix at bind time. (Cluster
          // "Transform" means different things to different exporters, so the
          // mesh's bind matrix comes from the BindPose, or its node.)
          const link = matrixOf(fbxValue<Float64Array>(cluster.node, 'TransformLink'));
          const inverseBind = mat4.invert(mat4.create(), link) ?? mat4.create();
          skin.inverseBindMatrices.push(mat4.multiply(inverseBind, inverseBind, meshAtBind));
        }
        node.skin = this.model.skins.length;
        this.model.skins.push(skin);
      }

      const material = this.childrenOf(model.id).find((o) => o.kind === 'Material');
      if (material) node.material = this.readMaterial(material);
    }
  }

  private readMaterial(material: FbxObject): number {
    const known = this.materialIndexById.get(material.id);
    if (known !== undefined) return known;
    const p = props70(material.node);
    const diffuse = (p.get('DiffuseColor') ?? p.get('Diffuse') ?? [0.8, 0.8, 0.8]) as number[];
    const result: ModelMaterial = { name: material.name, color: [diffuse[0], diffuse[1], diffuse[2], 1] };
    for (const c of this.connections) {
      if (c.type !== 'OP' || c.parent !== material.id) continue;
      const texture = this.objects.get(c.child);
      if (texture?.kind !== 'Texture') continue;
      const image = this.readTextureImage(texture);
      if (image === undefined) continue;
      const slot = c.property ?? '';
      if (/^Diffuse/.test(slot)) result.albedo = image;
      else if (/Normal|Bump/.test(slot)) result.normal = image;
      else if (/^Specular|Reflection/.test(slot)) result.specular = image;
      else if (/^Emissive|Glow/.test(slot)) result.emissive = image;
    }
    if (result.albedo !== undefined) result.color = [1, 1, 1, 1];
    this.materialIndexById.set(material.id, this.model.materials.length);
    this.model.materials.push(result);
    return this.model.materials.length - 1;
  }

  private readTextureImage(texture: FbxObject): number | undefined {
    const video = this.childrenOf(texture.id).find((o) => o.kind === 'Video');
    if (!video) return undefined;
    const known = this.imageIndexById.get(video.id);
    if (known !== undefined) return known;
    const content = fbxValue<Uint8Array>(video.node, 'Content');
    if (!(content instanceof Uint8Array) || content.length === 0) return undefined; // not embedded
    const file = String(fbxValue(video.node, 'RelativeFilename') ?? fbxValue(video.node, 'Filename') ?? video.name);
    const name = file.split(/[\\/]/).pop() ?? file;
    const image: ModelImage = { name, mimeType: mimeOf(content, name), data: content };
    this.imageIndexById.set(video.id, this.model.images.length);
    this.model.images.push(image);
    return this.model.images.length - 1;
  }

  // --- Animation ------------------------------------------------------------

  private readAnimations(): void {
    for (const stack of this.objects.values()) {
      if (stack.kind !== 'AnimationStack') continue;
      const clip = this.readStack(stack);
      if (clip) this.model.clips.push(clip);
    }
  }

  private readStack(stack: FbxObject): AnimationClip | null {
    interface Curves { T: (FbxCurve | number)[]; R: (FbxCurve | number)[]; S: (FbxCurve | number)[] }
    const perNode = new Map<number, Curves>();
    let start = Infinity, end = -Infinity;

    for (const layer of this.childrenOf(stack.id).filter((o) => o.kind === 'AnimationLayer')) {
      for (const curveNode of this.childrenOf(layer.id).filter((o) => o.kind === 'AnimationCurveNode')) {
        const target = this.connections.find((c) => c.type === 'OP' && c.child === curveNode.id && this.objects.get(c.parent)?.kind === 'Model');
        if (!target) continue;
        const channel = target.property === 'Lcl Translation' ? 'T' : target.property === 'Lcl Rotation' ? 'R' : target.property === 'Lcl Scaling' ? 'S' : null;
        const nodeIndex = this.nodeIndexById.get(target.parent);
        if (!channel || nodeIndex === undefined) continue;
        const defaults = props70(curveNode.node);
        const node = this.model.nodes[nodeIndex];
        const entry = perNode.get(nodeIndex) ?? { T: [], R: [], S: [] };
        const lcl = channel === 'T' ? node.translation : channel === 'S' ? node.scale : null;
        ['X', 'Y', 'Z'].forEach((axis, k) => {
          const link = this.connections.find((c) => c.type === 'OP' && c.parent === curveNode.id && c.property === `d|${axis}`);
          const curve = link && this.objects.get(link.child);
          if (curve?.kind === 'AnimationCurve') {
            const times = fbxValue<Float64Array>(curve.node, 'KeyTime');
            const values = fbxValue<Float32Array | Float64Array>(curve.node, 'KeyValueFloat');
            if (times && values && times.length) {
              entry[channel][k] = { times, values };
              start = Math.min(start, times[0]);
              end = Math.max(end, times[times.length - 1]);
              return;
            }
          }
          const fallback = defaults.get(`d|${axis}`)?.[0];
          entry[channel][k] = typeof fallback === 'number' ? fallback : lcl ? lcl[k] : 0;
        });
        perNode.set(nodeIndex, entry);
      }
    }
    if (!perNode.size || !isFinite(start)) return null;

    const frames = Math.max(1, Math.round(((end - start) / TICKS_PER_SECOND) * this.fps)) + 1;
    const times = new Float32Array(frames);
    for (let f = 0; f < frames; f++) times[f] = f / this.fps;
    const tick = (f: number) => start + (f / this.fps) * TICKS_PER_SECOND;

    const channels: AnimationChannel[] = [];
    for (const [nodeIndex, curves] of perNode) {
      const node = this.model.nodes[nodeIndex];
      const fbxNode = this.fbxNodeOf(nodeIndex);
      if (curves.T.length) {
        const values = new Float32Array(frames * 3);
        for (let f = 0; f < frames; f++) for (let k = 0; k < 3; k++) values[f * 3 + k] = evaluate(curves.T[k], tick(f));
        channels.push({ target: node.name, property: 'translation', times, values, interpolation: 'LINEAR' });
      }
      if (curves.R.length) {
        const p = props70(fbxNode);
        const order = Number(p.get('RotationOrder')?.[0] ?? 0);
        const pre = eulerToQuat(vec3Of(p.get('PreRotation')), 0);
        const postInv = quat.invert(quat.create(), eulerToQuat(vec3Of(p.get('PostRotation')), 0));
        const values = new Float32Array(frames * 4);
        const q = quat.create();
        for (let f = 0; f < frames; f++) {
          const euler = vec3.fromValues(evaluate(curves.R[0], tick(f)), evaluate(curves.R[1], tick(f)), evaluate(curves.R[2], tick(f)));
          quat.multiply(q, pre, eulerToQuat(euler, order));
          quat.multiply(q, q, postInv);
          quat.normalize(q, q);
          // Keep neighbouring keys in the same hemisphere so LINEAR blends the short way.
          if (f > 0 && q[0] * values[f * 4 - 4] + q[1] * values[f * 4 - 3] + q[2] * values[f * 4 - 2] + q[3] * values[f * 4 - 1] < 0) {
            quat.scale(q, q, -1);
          }
          values.set(q, f * 4);
        }
        channels.push({ target: node.name, property: 'rotation', times, values, interpolation: 'LINEAR' });
      }
      if (curves.S.length) {
        const values = new Float32Array(frames * 3);
        for (let f = 0; f < frames; f++) for (let k = 0; k < 3; k++) values[f * 3 + k] = evaluate(curves.S[k], tick(f));
        channels.push({ target: node.name, property: 'scale', times, values, interpolation: 'LINEAR' });
      }
    }
    // Mixamo calls every take "mixamo.com": number them when they repeat.
    return new AnimationClip(stack.name || `Clip ${this.model.clips.length}`, channels);
  }

  // --- Helpers ----------------------------------------------------------------

  /** Objects connected to `parentId` as children (OO or OP). */
  private childrenOf(parentId: number): FbxObject[] {
    const out: FbxObject[] = [];
    for (const c of this.connections) {
      if (c.parent !== parentId) continue;
      const o = this.objects.get(c.child);
      if (o) out.push(o);
    }
    return out;
  }

  private bindPoseMatrices?: Map<number, mat4>;

  /** Global matrices at bind time of the nodes listed in the BindPose. */
  private bindPose(): Map<number, mat4> {
    if (this.bindPoseMatrices) return this.bindPoseMatrices;
    this.bindPoseMatrices = new Map();
    for (const pose of this.objects.values()) {
      if (pose.kind !== 'Pose' || pose.type !== 'BindPose') continue;
      for (const poseNode of pose.node.children.filter((c) => c.name === 'PoseNode')) {
        const id = fbxValue<number>(poseNode, 'Node');
        const matrix = fbxValue<Float64Array>(poseNode, 'Matrix');
        if (typeof id === 'number' && matrix) this.bindPoseMatrices.set(id, matrixOf(matrix));
      }
    }
    return this.bindPoseMatrices;
  }

  /** A node's global matrix from the local transforms of its ancestors. */
  private globalMatrix(nodeIndex: number): mat4 {
    const node = this.model.nodes[nodeIndex];
    const local = mat4.fromRotationTranslationScale(mat4.create(), node.rotation, node.translation, node.scale);
    return node.parent >= 0 ? mat4.multiply(local, this.globalMatrix(node.parent), local) : local;
  }

  private fbxNodeOf(nodeIndex: number): FbxNode | undefined {
    for (const [id, index] of this.nodeIndexById) if (index === nodeIndex) return this.objects.get(id)?.node;
    return undefined;
  }
}

// --- Geometry -------------------------------------------------------------------

interface LayerReader {
  /** The index into the layer's data for a polygon corner. */
  index(polygonVertex: number, controlPoint: number, polygon: number): number;
  data: Float64Array | Float32Array;
}

function layer(element: FbxNode | undefined, dataName: string, indexName: string): LayerReader | null {
  const data = fbxValue<Float64Array | Float32Array>(element, dataName);
  if (!element || !data) return null;
  const mapping = String(fbxValue(element, 'MappingInformationType') ?? 'ByPolygonVertex');
  const reference = String(fbxValue(element, 'ReferenceInformationType') ?? 'Direct');
  const indices = fbxValue<Int32Array>(element, indexName);
  const byIndex = reference !== 'Direct' && indices instanceof Int32Array;
  return {
    data,
    index(pv, cp, polygon) {
      const i = mapping === 'ByPolygonVertex' ? pv
        : mapping === 'ByPolygon' ? polygon
        : mapping === 'AllSame' ? 0
        : cp; // ByVertice / ByVertex / ByControlPoint
      return byIndex ? indices![i] : i;
    },
  };
}

/**
 * Builds the mesh of a Geometry node: polygons become triangles (fan), and
 * a polygon corner becomes a new vertex when its normal or UV differs from
 * the other corners sharing its control point.
 */
function buildMesh(geometry: FbxNode, clusters: FbxNode[]): MeshData {
  const points = fbxValue<Float64Array>(geometry, 'Vertices') ?? new Float64Array(0);
  const polygons = fbxValue<Int32Array>(geometry, 'PolygonVertexIndex') ?? new Int32Array(0);
  const normals = layer(fbxChild(geometry, 'LayerElementNormal'), 'Normals', 'NormalsIndex');
  const uvs = layer(fbxChild(geometry, 'LayerElementUV'), 'UV', 'UVIndex');

  // Skin weights per control point, from the clusters (cluster index = joint index).
  const influences: [number, number][][] = Array.from({ length: points.length / 3 }, () => []);
  clusters.forEach((cluster, joint) => {
    const indexes = fbxValue<Int32Array>(cluster, 'Indexes');
    const weights = fbxValue<Float64Array>(cluster, 'Weights');
    if (!indexes || !weights) return;
    for (let i = 0; i < indexes.length; i++) influences[indexes[i]]?.push([joint, weights[i]]);
  });
  const skinned = clusters.length > 0;
  const mesh = skinned ? new SkinnedMeshData([]) : new MeshData([]);
  mesh.providedNormals = !!normals;
  const joints: number[] = [];
  const weights: number[] = [];
  const vertexByKey = new Map<string, number>();
  let missingWeights = 0;

  const addVertex = (pv: number, cp: number, polygon: number): number => {
    const ni = normals ? normals.index(pv, cp, polygon) : -1;
    const ui = uvs ? uvs.index(pv, cp, polygon) : -1;
    const key = `${cp}/${ni}/${ui}`;
    let index = vertexByKey.get(key);
    if (index !== undefined) return index;
    index = mesh.vertices.length;
    vertexByKey.set(key, index);
    mesh.vertices.push(vec3.fromValues(points[cp * 3], points[cp * 3 + 1], points[cp * 3 + 2]));
    if (normals) mesh.normals.push(vec3.fromValues(normals.data[ni * 3], normals.data[ni * 3 + 1], normals.data[ni * 3 + 2]));
    // FBX UVs start at the bottom of the image; textures here are uploaded top row first.
    mesh.uvs.push(uvs ? vec2.fromValues(uvs.data[ui * 2], 1 - uvs.data[ui * 2 + 1]) : vec2.create());
    if (skinned) {
      const top = influences[cp].slice().sort((a, b) => b[1] - a[1]).slice(0, 4);
      const sum = top.reduce((s, w) => s + w[1], 0);
      if (sum <= 0) missingWeights++;
      for (let k = 0; k < 4; k++) {
        joints.push(top[k]?.[0] ?? 0);
        weights.push(sum > 0 ? (top[k]?.[1] ?? 0) / sum : k === 0 ? 1 : 0);
      }
    }
    return index;
  };

  let corners: number[] = [];
  let polygon = 0;
  for (let pv = 0; pv < polygons.length; pv++) {
    const raw = polygons[pv];
    const cp = raw < 0 ? ~raw : raw;
    corners.push(addVertex(pv, cp, polygon));
    if (raw < 0) {
      for (let k = 1; k + 1 < corners.length; k++) mesh.indices.push(corners[0], corners[k], corners[k + 1]);
      corners = [];
      polygon++;
    }
  }
  if (mesh instanceof SkinnedMeshData) {
    mesh.joints = Uint16Array.from(joints);
    mesh.weights = Float32Array.from(weights);
    if (missingWeights) console.warn(`FBX: ${missingWeights} skinned vertices had no weights; bound to the first bone.`);
  }
  return mesh;
}

// --- Transforms -------------------------------------------------------------------

/** A node's local transform: T * Rpre * R * inverse(Rpost) * S (pivots ignored). */
function localTransform(node: FbxNode): Pick<ModelNode, 'translation' | 'rotation' | 'scale'> {
  const p = props70(node);
  const order = Number(p.get('RotationOrder')?.[0] ?? 0);
  const rotation = quat.multiply(quat.create(), eulerToQuat(vec3Of(p.get('PreRotation')), 0), eulerToQuat(vec3Of(p.get('Lcl Rotation')), order));
  const post = eulerToQuat(vec3Of(p.get('PostRotation')), 0);
  quat.multiply(rotation, rotation, quat.invert(post, post));
  quat.normalize(rotation, rotation);
  const scale = p.has('Lcl Scaling') ? vec3Of(p.get('Lcl Scaling')) : vec3.fromValues(1, 1, 1);
  for (const pivot of ['RotationPivot', 'ScalingPivot', 'RotationOffset', 'ScalingOffset']) {
    const v = p.get(pivot);
    if (v && (v[0] || v[1] || v[2])) {
      console.warn(`FBX: ${pivot} of "${cleanName(String(node.props[1]))}" is ignored.`);
      break;
    }
  }
  return { translation: vec3Of(p.get('Lcl Translation')), rotation, scale };
}

/** FBX Euler orders, in the order the axes are applied. */
const EULER_ORDERS = ['XYZ', 'XZY', 'YZX', 'YXZ', 'ZXY', 'ZYX', 'XYZ'];
const AXES: Record<string, vec3> = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1] };

/** Euler angles in degrees to a quaternion; the first axis of the order is applied first. */
export function eulerToQuat(degrees: vec3, order: number): quat {
  const out = quat.create();
  const step = quat.create();
  for (const axis of EULER_ORDERS[order] ?? 'XYZ') {
    const angle = degrees['XYZ'.indexOf(axis)] * (Math.PI / 180);
    quat.setAxisAngle(step, AXES[axis], angle);
    quat.multiply(out, step, out); // later rotations multiply from the left
  }
  return out;
}

function matrixOf(values: Float64Array | undefined): mat4 {
  return values && values.length === 16 ? mat4.clone(Array.from(values) as unknown as mat4) : mat4.create();
}

function vec3Of(values: FbxProp[] | undefined): vec3 {
  return values ? vec3.fromValues(Number(values[0]) || 0, Number(values[1]) || 0, Number(values[2]) || 0) : vec3.create();
}

// --- Curves -------------------------------------------------------------------------

interface FbxCurve {
  times: Float64Array;
  values: Float32Array | Float64Array;
}

/** A curve's value at an FBX time (linear between keys), or a constant. */
function evaluate(curve: FbxCurve | number, time: number): number {
  if (typeof curve === 'number') return curve;
  const { times, values } = curve;
  const n = times.length;
  if (time <= times[0]) return values[0];
  if (time >= times[n - 1]) return values[n - 1];
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= time) lo = mid; else hi = mid;
  }
  const s = (time - times[lo]) / (times[hi] - times[lo]);
  return values[lo] + (values[hi] - values[lo]) * s;
}

// --- Small helpers ------------------------------------------------------------------

/** `Properties70` of a node: property name -> its values (after name, type, label, flags). */
function props70(node: FbxNode | undefined): Map<string, FbxProp[]> {
  const map = new Map<string, FbxProp[]>();
  for (const p of fbxChild(node, 'Properties70')?.children ?? []) {
    map.set(String(p.props[0]), p.props.slice(4));
  }
  return map;
}

/** "mixamorig:Hips\u0000\u0001Model" -> "mixamorig:Hips". */
function cleanName(name: string): string {
  return (name ?? '').split('\u0000')[0];
}

function mimeOf(data: Uint8Array, name: string): string {
  if (data[0] === 0x89 && data[1] === 0x50) return 'image/png';
  if (data[0] === 0xff && data[1] === 0xd8) return 'image/jpeg';
  return /\.jpe?g$/i.test(name) ? 'image/jpeg' : 'image/png';
}

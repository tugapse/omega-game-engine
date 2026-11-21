import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import { AnimationChannel, AnimationClip } from '../../animation/animation-clip';
import { MeshData } from '../../core/mesh';
import { ModelData, ModelMaterial, ModelNode, ModelSkin, SkinnedMeshData } from '../../core/model/model-data';
import { XmlElement, parseXml, xmlChild, xmlChildren, xmlDescendants } from '../xml';

/** Whether the bytes look like a COLLADA (.dae) document. */
export function isCollada(buffer: ArrayBuffer): boolean {
  const head = new TextDecoder('utf-8').decode(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 2048)));
  return head.includes('<COLLADA');
}

/**
 * Reads a COLLADA 1.4 document (.dae), as exported by Mixamo, Blender or
 * Maya, into a ModelData: node tree, meshes (one per primitive list, so one
 * per material), skins with their inverse bind matrices, materials and
 * matrix animations (decomposed into translation/rotation/scale clips).
 *
 * Images are separate files: `ModelImage.path` holds their path relative to
 * the .dae; the host resolves it (see `instantiateModel`'s `resolveImage`).
 */
export function parseCollada(text: string): ModelData {
  return new ColladaConverter(parseXml(text)).convert();
}

/** A primitive list turned into a mesh, before skinning. */
interface Primitive {
  mesh: MeshData;
  /** Material symbol (bound to a material by `instance_*`/`bind_material`). */
  material: string;
  /** For each mesh vertex, the index of its position in the geometry. */
  positionOf: number[];
}

class ColladaConverter {
  private readonly ids = new Map<string, XmlElement>();
  private readonly model: ModelData = { nodes: [], meshes: [], skins: [], clips: [], materials: [], images: [], unitScale: 1 };
  private readonly collada: XmlElement;
  private readonly nodeIndex = { byId: new Map<string, number>(), bySid: new Map<string, number>(), byName: new Map<string, number>() };
  private readonly imageIndexById = new Map<string, number>();
  private readonly materialIndexById = new Map<string, number>();
  private readonly geometryCache = new Map<string, Primitive[]>();
  private readonly pendingSkins: { node: number; controller: XmlElement; skeleton?: string; bindings: Map<string, string> }[] = [];

  constructor(document: XmlElement) {
    this.collada = xmlChild(document, 'COLLADA') ?? document;
    const index = (el: XmlElement) => {
      if (el.attrs.id) this.ids.set(el.attrs.id, el);
      el.children.forEach(index);
    };
    index(this.collada);
  }

  convert(): ModelData {
    const asset = xmlChild(this.collada, 'asset');
    const meter = Number(xmlChild(asset, 'unit')?.attrs.meter);
    if (meter > 0) this.model.unitScale = meter;
    const up = xmlChild(asset, 'up_axis')?.text.trim();
    if (up && up !== 'Y_UP') console.warn(`COLLADA: ${up} is not converted; the model may lie on its side.`);

    const sceneUrl = xmlChild(xmlChild(this.collada, 'scene'), 'instance_visual_scene')?.attrs.url;
    const scene = (sceneUrl && this.ref(sceneUrl)) || xmlDescendants(this.collada, 'visual_scene')[0];
    for (const node of xmlChildren(scene, 'node')) this.readNode(node, -1);
    for (const skin of this.pendingSkins) this.readSkin(skin);
    this.readAnimations();
    return this.model;
  }

  // --- Nodes ---------------------------------------------------------------

  private readNode(el: XmlElement, parent: number): void {
    const index = this.model.nodes.length;
    const local = this.localMatrix(el);
    const node: ModelNode = {
      name: el.attrs.name || el.attrs.id || el.attrs.sid || `Node ${index}`,
      parent,
      translation: mat4.getTranslation(vec3.create(), local),
      rotation: quat.normalize(quat.create(), mat4.getRotation(quat.create(), local)),
      scale: mat4.getScaling(vec3.create(), local),
    };
    this.model.nodes.push(node);
    if (el.attrs.id) this.nodeIndex.byId.set(el.attrs.id, index);
    if (el.attrs.sid) this.nodeIndex.bySid.set(el.attrs.sid, index);
    this.nodeIndex.byName.set(node.name, index);

    for (const inst of xmlChildren(el, 'instance_geometry')) {
      const geometry = this.ref(inst.attrs.url);
      if (geometry) this.attachPrimitives(index, this.readGeometry(geometry), this.materialBindings(inst));
    }
    for (const inst of xmlChildren(el, 'instance_controller')) {
      const controller = this.ref(inst.attrs.url);
      if (controller) {
        const skeleton = xmlChild(inst, 'skeleton')?.text.trim();
        this.pendingSkins.push({ node: index, controller, skeleton, bindings: this.materialBindings(inst) });
      }
    }
    for (const child of xmlChildren(el, 'node')) this.readNode(child, index);
  }

  /** A node's local matrix: `matrix`, or `translate`/`rotate`/`scale` in order. */
  private localMatrix(el: XmlElement): mat4 {
    const m = mat4.create();
    for (const t of el.children) {
      const v = numbers(t.text);
      if (t.tag === 'matrix' && v.length >= 16) mat4.multiply(m, m, rowMajor(v));
      else if (t.tag === 'translate') mat4.translate(m, m, [v[0], v[1], v[2]]);
      else if (t.tag === 'rotate') mat4.rotate(m, m, (v[3] * Math.PI) / 180, [v[0], v[1], v[2]]);
      else if (t.tag === 'scale') mat4.scale(m, m, [v[0], v[1], v[2]]);
    }
    return m;
  }

  /** Material symbol -> material id, from `bind_material`. */
  private materialBindings(inst: XmlElement): Map<string, string> {
    const map = new Map<string, string>();
    for (const im of xmlDescendants(inst, 'instance_material')) map.set(im.attrs.symbol, im.attrs.target.replace(/^#/, ''));
    return map;
  }

  /** The first primitive goes on the node; others on child nodes (one mesh and material each). */
  private attachPrimitives(nodeIndex: number, primitives: Primitive[], bindings: Map<string, string>, skin?: number): void {
    primitives.forEach((primitive, k) => {
      let target = nodeIndex;
      if (k > 0) {
        target = this.model.nodes.length;
        const owner = this.model.nodes[nodeIndex];
        this.model.nodes.push({ name: `${owner.name} (${primitive.material || k})`, parent: nodeIndex, translation: vec3.create(), rotation: quat.create(), scale: vec3.fromValues(1, 1, 1) });
      }
      const node = this.model.nodes[target];
      node.mesh = this.model.meshes.length;
      this.model.meshes.push(primitive.mesh);
      if (skin !== undefined) node.skin = skin;
      const materialId = bindings.get(primitive.material) ?? primitive.material;
      const material = materialId ? this.readMaterial(materialId) : undefined;
      if (material !== undefined) node.material = material;
    });
  }

  // --- Geometry ------------------------------------------------------------

  private readGeometry(geometry: XmlElement): Primitive[] {
    const cached = this.geometryCache.get(geometry.attrs.id);
    if (cached) return cached;
    const mesh = xmlChild(geometry, 'mesh');
    const primitives: Primitive[] = [];
    for (const list of mesh?.children ?? []) {
      if (!['triangles', 'polylist', 'polygons'].includes(list.tag)) continue;
      primitives.push(this.readPrimitive(mesh!, list));
    }
    this.geometryCache.set(geometry.attrs.id, primitives);
    return primitives;
  }

  private readPrimitive(mesh: XmlElement, list: XmlElement): Primitive {
    interface Input { semantic: string; offset: number; data: Float64Array; stride: number }
    const inputs: Input[] = [];
    for (const input of xmlChildren(list, 'input')) {
      const offset = Number(input.attrs.offset ?? 0);
      if (input.attrs.semantic === 'VERTEX') {
        const vertices = this.ref(input.attrs.source);
        for (const vi of xmlChildren(vertices, 'input')) {
          const src = this.readSource(this.ref(vi.attrs.source));
          inputs.push({ semantic: vi.attrs.semantic, offset, ...src });
        }
      } else if (input.attrs.semantic === 'NORMAL' || (input.attrs.semantic === 'TEXCOORD' && !inputs.some((i) => i.semantic === 'TEXCOORD'))) {
        inputs.push({ semantic: input.attrs.semantic, offset, ...this.readSource(this.ref(input.attrs.source)) });
      }
    }
    const stride = Math.max(...xmlChildren(list, 'input').map((i) => Number(i.attrs.offset ?? 0))) + 1;
    const position = inputs.find((i) => i.semantic === 'POSITION');
    const normal = inputs.find((i) => i.semantic === 'NORMAL');
    const uv = inputs.find((i) => i.semantic === 'TEXCOORD');

    // Polygon sizes and the flat index list.
    const pLists = xmlChildren(list, 'p').map((p) => numbers(p.text));
    const counts: number[] = [];
    let indices: number[] = [];
    if (list.tag === 'polylist') {
      counts.push(...numbers(xmlChild(list, 'vcount')?.text ?? ''));
      indices = pLists[0] ?? [];
    } else if (list.tag === 'triangles') {
      indices = pLists[0] ?? [];
      for (let k = 0; k < indices.length / stride / 3; k++) counts.push(3);
    } else {
      for (const p of pLists) { counts.push(p.length / stride); indices.push(...p); }
    }

    const out = new MeshData([]);
    out.providedNormals = !!normal;
    const positionOf: number[] = [];
    const byKey = new Map<string, number>();
    let cursor = 0;
    for (const count of counts) {
      const corners: number[] = [];
      for (let c = 0; c < count; c++, cursor++) {
        const base = cursor * stride;
        const pi = position ? indices[base + position.offset] : 0;
        const ni = normal ? indices[base + normal.offset] : -1;
        const ui = uv ? indices[base + uv.offset] : -1;
        const key = `${pi}/${ni}/${ui}`;
        let v = byKey.get(key);
        if (v === undefined) {
          v = out.vertices.length;
          byKey.set(key, v);
          positionOf.push(pi);
          const p = position!.data, ps = position!.stride;
          out.vertices.push(vec3.fromValues(p[pi * ps], p[pi * ps + 1], p[pi * ps + 2]));
          if (normal) out.normals.push(vec3.fromValues(normal.data[ni * normal.stride], normal.data[ni * normal.stride + 1], normal.data[ni * normal.stride + 2]));
          // COLLADA UVs start at the bottom of the image; textures here are uploaded top row first.
          out.uvs.push(uv ? vec2.fromValues(uv.data[ui * uv.stride], 1 - uv.data[ui * uv.stride + 1]) : vec2.create());
        }
        corners.push(v);
      }
      for (let k = 1; k + 1 < corners.length; k++) out.indices.push(corners[0], corners[k], corners[k + 1]);
    }
    return { mesh: out, material: list.attrs.material ?? '', positionOf };
  }

  // --- Skins ---------------------------------------------------------------

  private readSkin(entry: { node: number; controller: XmlElement; skeleton?: string; bindings: Map<string, string> }): void {
    const skinEl = xmlChild(entry.controller, 'skin');
    const geometry = skinEl && this.ref(skinEl.attrs.source);
    if (!skinEl || !geometry) return;
    const bindShape = rowMajor(numbers(xmlChild(skinEl, 'bind_shape_matrix')?.text ?? '1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1'));
    const jointsInput = xmlChildren(xmlChild(skinEl, 'joints'), 'input');
    const jointNames = this.readNames(this.ref(jointsInput.find((i) => i.attrs.semantic === 'JOINT')?.attrs.source));
    const invBind = this.readSource(this.ref(jointsInput.find((i) => i.attrs.semantic === 'INV_BIND_MATRIX')?.attrs.source));

    const skin: ModelSkin = { joints: [], inverseBindMatrices: [] };
    jointNames.forEach((name, j) => {
      const node = this.nodeIndex.bySid.get(name) ?? this.nodeIndex.byName.get(name) ?? this.nodeIndex.byId.get(name);
      if (node === undefined) console.warn(`COLLADA: joint "${name}" has no node; using the first node.`);
      skin.joints.push(node ?? 0);
      const m = rowMajor(Array.from(invBind.data.subarray(j * 16, j * 16 + 16)));
      // Vertices are first moved by the bind shape matrix, then into bone space.
      skin.inverseBindMatrices.push(mat4.multiply(m, m, bindShape));
    });

    // Influences per geometry position.
    const vw = xmlChild(skinEl, 'vertex_weights')!;
    const vwInputs = xmlChildren(vw, 'input');
    const vwStride = Math.max(...vwInputs.map((i) => Number(i.attrs.offset ?? 0))) + 1;
    const jointOffset = Number(vwInputs.find((i) => i.attrs.semantic === 'JOINT')?.attrs.offset ?? 0);
    const weightInput = vwInputs.find((i) => i.attrs.semantic === 'WEIGHT');
    const weightOffset = Number(weightInput?.attrs.offset ?? 1);
    const weightValues = this.readSource(this.ref(weightInput?.attrs.source)).data;
    const vcount = numbers(xmlChild(vw, 'vcount')?.text ?? '');
    const v = numbers(xmlChild(vw, 'v')?.text ?? '');
    const influences: [number, number][][] = [];
    let cursor = 0;
    vcount.forEach((count, position) => {
      const list: [number, number][] = [];
      for (let k = 0; k < count; k++, cursor++) {
        const joint = v[cursor * vwStride + jointOffset];
        const weight = weightValues[v[cursor * vwStride + weightOffset]];
        if (joint >= 0) list.push([joint, weight]);
      }
      influences[position] = list;
    });

    const skinIndex = this.model.skins.length;
    this.model.skins.push(skin);
    const primitives = this.readGeometry(geometry).map((p) => ({ ...p, mesh: toSkinned(p, influences) }));
    this.attachPrimitives(entry.node, primitives, entry.bindings, skinIndex);
  }

  // --- Materials -----------------------------------------------------------

  private readMaterial(id: string): number | undefined {
    const known = this.materialIndexById.get(id);
    if (known !== undefined) return known;
    const material = this.ids.get(id);
    if (!material) return undefined;
    const effect = this.ref(xmlChild(material, 'instance_effect')?.attrs.url);
    const result: ModelMaterial = { name: material.attrs.name || id, color: [0.8, 0.8, 0.8, 1] };
    const profile = xmlChild(effect, 'profile_COMMON');
    // newparam sid -> surface image id, or sampler -> surface sid.
    const params = new Map<string, XmlElement>();
    for (const p of xmlChildren(profile, 'newparam')) params.set(p.attrs.sid, p);
    const imageOfSampler = (sampler: string): number | undefined => {
      const samplerParam = params.get(sampler);
      const surfaceSid = xmlChild(xmlChild(samplerParam, 'sampler2D'), 'source')?.text.trim();
      const surface = surfaceSid ? params.get(surfaceSid) : undefined;
      const imageId = xmlChild(xmlChild(surface, 'surface'), 'init_from')?.text.trim() ?? sampler; // some files point at the image directly
      return this.readImage(imageId);
    };
    const technique = xmlChild(profile, 'technique');
    const shading = technique?.children.find((c) => ['phong', 'lambert', 'blinn', 'constant'].includes(c.tag));
    const slot = (name: string) => xmlChild(shading, name);
    const texture = (el: XmlElement | undefined) => {
      const t = xmlChild(el, 'texture');
      return t ? imageOfSampler(t.attrs.texture) : undefined;
    };
    const diffuse = slot('diffuse');
    result.albedo = texture(diffuse);
    const color = numbers(xmlChild(diffuse, 'color')?.text ?? '');
    if (result.albedo !== undefined) result.color = [1, 1, 1, 1];
    else if (color.length >= 3) result.color = [color[0], color[1], color[2], 1];
    result.emissive = texture(slot('emission'));
    result.specular = texture(slot('specular'));
    // Normal maps live in extensions: Maya's <bump>, or FCOLLADA's <displacement> (Mixamo).
    const bump = xmlDescendants(effect, 'bump')[0] ?? xmlDescendants(effect, 'displacement')[0];
    result.normal = texture(bump);
    this.materialIndexById.set(id, this.model.materials.length);
    this.model.materials.push(result);
    return this.model.materials.length - 1;
  }

  private readImage(id: string): number | undefined {
    const known = this.imageIndexById.get(id);
    if (known !== undefined) return known;
    const image = this.ids.get(id);
    const from = xmlChild(image, 'init_from');
    const path = (xmlChild(from, 'ref')?.text ?? from?.text ?? '').trim();
    if (!image || !path) return undefined;
    const name = decodeURIComponent(path.split(/[\\/]/).pop() ?? path);
    this.imageIndexById.set(id, this.model.images.length);
    this.model.images.push({ name, mimeType: /\.jpe?g$/i.test(name) ? 'image/jpeg' : 'image/png', path: path.replace(/^file:\/\/\/?/, '') });
    return this.model.images.length - 1;
  }

  // --- Animation -----------------------------------------------------------

  private readAnimations(): void {
    const channels: AnimationChannel[] = [];
    let skipped = 0;
    for (const animation of xmlDescendants(xmlChild(this.collada, 'library_animations'), 'animation')) {
      for (const channel of xmlChildren(animation, 'channel')) {
        const [nodeId, targetPart] = (channel.attrs.target ?? '').split('/');
        const node = this.nodeIndex.byId.get(nodeId);
        const sampler = this.ref(channel.attrs.source);
        if (node === undefined || !sampler) continue;
        const inputs = xmlChildren(sampler, 'input');
        const times = this.readSource(this.ref(inputs.find((i) => i.attrs.semantic === 'INPUT')?.attrs.source)).data;
        const output = this.readSource(this.ref(inputs.find((i) => i.attrs.semantic === 'OUTPUT')?.attrs.source));
        if (output.stride !== 16 || !/^(transform|matrix)/.test(targetPart ?? '')) { skipped++; continue; }
        channels.push(...matrixChannels(this.model.nodes[node].name, times, output.data));
      }
    }
    if (skipped) console.warn(`COLLADA: ${skipped} animation channels that are not whole matrices were skipped.`);
    if (channels.length) this.model.clips.push(new AnimationClip('Animation', channels));
  }

  // --- Sources ---------------------------------------------------------------

  /** An element by `#id` (or bare id). */
  private ref(url: string | undefined): XmlElement | undefined {
    return url ? this.ids.get(url.replace(/^#/, '')) : undefined;
  }

  private readSource(source: XmlElement | undefined): { data: Float64Array; stride: number } {
    const array = xmlChild(source, 'float_array');
    const accessor = xmlChild(xmlChild(source, 'technique_common'), 'accessor');
    return { data: Float64Array.from(numbers(array?.text ?? '')), stride: Number(accessor?.attrs.stride ?? 1) };
  }

  private readNames(source: XmlElement | undefined): string[] {
    const array = xmlChild(source, 'Name_array') ?? xmlChild(source, 'IDREF_array');
    return (array?.text ?? '').trim().split(/\s+/).filter(Boolean);
  }
}

/** The numbers in a whitespace-separated list. */
function numbers(text: string): number[] {
  const out: number[] = [];
  for (const t of text.split(/\s+/)) if (t) out.push(Number(t));
  return out;
}

/** COLLADA matrices are written row by row; gl-matrix stores columns. */
function rowMajor(v: ArrayLike<number>): mat4 {
  const m = mat4.create();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) m[c * 4 + r] = v[r * 4 + c];
  return m;
}

/** A primitive's mesh with 4 joints and weights per vertex, from per-position influences. */
function toSkinned(primitive: Primitive, influences: [number, number][][]): SkinnedMeshData {
  const src = primitive.mesh;
  const mesh = new SkinnedMeshData(src.vertices, src.normals, src.uvs, src.indices);
  mesh.providedNormals = src.providedNormals;
  const joints = new Uint16Array(src.vertices.length * 4);
  const weights = new Float32Array(src.vertices.length * 4);
  primitive.positionOf.forEach((position, v) => {
    const top = (influences[position] ?? []).slice().sort((a, b) => b[1] - a[1]).slice(0, 4);
    const sum = top.reduce((s, w) => s + w[1], 0);
    for (let k = 0; k < 4; k++) {
      joints[v * 4 + k] = top[k]?.[0] ?? 0;
      weights[v * 4 + k] = sum > 0 ? (top[k]?.[1] ?? 0) / sum : k === 0 ? 1 : 0;
    }
  });
  mesh.joints = joints;
  mesh.weights = weights;
  return mesh;
}

/** Splits baked matrix keys into translation, rotation and scale channels. */
function matrixChannels(target: string, times: Float64Array, matrices: Float64Array): AnimationChannel[] {
  const n = times.length;
  const t = new Float32Array(n * 3), r = new Float32Array(n * 4), s = new Float32Array(n * 3);
  const m = mat4.create(), q = quat.create(), v = vec3.create();
  for (let k = 0; k < n; k++) {
    mat4.copy(m, rowMajor(matrices.subarray(k * 16, k * 16 + 16)));
    t.set(mat4.getTranslation(v, m), k * 3);
    mat4.getRotation(q, m);
    quat.normalize(q, q);
    if (k > 0 && q[0] * r[k * 4 - 4] + q[1] * r[k * 4 - 3] + q[2] * r[k * 4 - 2] + q[3] * r[k * 4 - 1] < 0) quat.scale(q, q, -1);
    r.set(q, k * 4);
    s.set(mat4.getScaling(v, m), k * 3);
  }
  const keys = Float32Array.from(times);
  return [
    { target, property: 'translation', times: keys, values: t, interpolation: 'LINEAR' },
    { target, property: 'rotation', times: keys, values: r, interpolation: 'LINEAR' },
    { target, property: 'scale', times: keys, values: s, interpolation: 'LINEAR' },
  ];
}

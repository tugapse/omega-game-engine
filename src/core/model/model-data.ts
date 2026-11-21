import { mat4, quat, vec3 } from 'gl-matrix';
import { MeshData } from '../mesh';
import { AnimationClip } from '../../animation/animation-clip';

/**
 * Mesh data with skinning: for every vertex, 4 joint indices (into the
 * skin's joint list) and their 4 weights, which sum to 1.
 */
export class SkinnedMeshData extends MeshData {
  public joints: Uint16Array = new Uint16Array(0);
  public weights: Float32Array = new Float32Array(0);
}

/** A node of an imported model: becomes an entity when the model is placed. */
export interface ModelNode {
  name: string;
  /** Index of the parent node, -1 for the top level. */
  parent: number;
  translation: vec3;
  rotation: quat;
  scale: vec3;
  /** Index in `ModelData.meshes`. */
  mesh?: number;
  /** Index in `ModelData.skins` (with `mesh`, a skinned mesh). */
  skin?: number;
  /** Index in `ModelData.materials`. */
  material?: number;
}

/** The bones of a skinned mesh and their bind pose. */
export interface ModelSkin {
  /** Node indices of the bones, in the order the mesh's joint indices use. */
  joints: number[];
  /** One inverse bind matrix per joint: mesh space to bone space at bind time. */
  inverseBindMatrices: mat4[];
}

export interface ModelMaterial {
  name: string;
  color: [number, number, number, number];
  /** Image indices in `ModelData.images`. */
  albedo?: number;
  normal?: number;
  specular?: number;
  emissive?: number;
}

/**
 * An image used by the model's materials: embedded in the file (`data`, as
 * in FBX) or a separate file next to it (`path`, relative, as in COLLADA).
 */
export interface ModelImage {
  name: string;
  mimeType: string;
  data?: Uint8Array;
  /** Path of an external image file, relative to the model file. */
  path?: string;
}

/**
 * Everything read from a model file (FBX, glTF), shared by every placed
 * copy of the model. Parts are addressed by URI fragments:
 * `<model uri>#mesh/0`, `#anim/0`, `#image/2`.
 */
export interface ModelData {
  nodes: ModelNode[];
  meshes: MeshData[];
  skins: ModelSkin[];
  clips: AnimationClip[];
  materials: ModelMaterial[];
  images: ModelImage[];
  /** Scale that turns the file's units into metres (0.01 for centimetres). */
  unitScale: number;
}

/** The kinds of model parts a URI fragment can name. */
export type ModelPartKind = 'mesh' | 'skin' | 'anim' | 'image';

/** Splits `asset://id#mesh/0` into the model URI and the part. */
export function parseModelPartUri(uri: string): { modelUri: string; kind: ModelPartKind; index: number } | null {
  const hash = uri.indexOf('#');
  if (hash < 0) return null;
  const match = /^(mesh|skin|anim|image)\/(\d+)$/.exec(uri.slice(hash + 1));
  if (!match) return null;
  return { modelUri: uri.slice(0, hash), kind: match[1] as ModelPartKind, index: Number(match[2]) };
}

export function modelPartUri(modelUri: string, kind: ModelPartKind, index: number): string {
  return `${modelUri}#${kind}/${index}`;
}

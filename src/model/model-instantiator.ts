import { Animator } from '../animation/animator';
import { MeshRendererBehaviour } from '../behaviours/renderer/mesh-renderer-behaviour';
import { SkinnedMeshRendererBehaviour } from '../behaviours/renderer/skinned-mesh-renderer-behaviour';
import { Color } from '../core/color';
import { Mesh } from '../core/mesh';
import { BuiltinTextures } from '../core/resources/builtin-textures';
import { Resources } from '../core/resources/resources';
import { ModelData, ModelImage, ModelMaterial, modelPartUri } from '../core/model/model-data';
import { SceneEntity } from '../entities/entity';
import type { Scene } from '../entities/scene';
import { LitMaterial } from '../materials/lit-material';
import { LitShader } from '../shaders/lit-shader';

export interface InstantiateModelOptions {
  /** Name of the root entity. Default: "Model". */
  name?: string;
  /** Add the entities to this scene (otherwise only return them). */
  scene?: Scene;
  /**
   * The texture URI of an image that is a separate file (COLLADA), from its
   * path relative to the model (e.g. "textures/body.png"). Return undefined
   * when it can't be found: the material then has no such texture.
   */
  resolveImage?: (path: string, image: ModelImage) => string | undefined;
}

/**
 * Places a model file in a scene as a tree of entities, like dropping it in
 * the editor: a root entity (scaled to metres, with an Animator when the file
 * has animations), one entity per node, and renderers on the mesh nodes.
 *
 * Bones are ordinary entities. The scene stores only the tree and the
 * references (`meshUri`, `boneIds`, `clipUris`), never the vertices.
 *
 * Returns the root and every entity created (root first), in parent order.
 */
export async function instantiateModel(
  gl: WebGL2RenderingContext,
  modelUri: string,
  options: InstantiateModelOptions = {},
): Promise<{ root: SceneEntity; entities: SceneEntity[] }> {
  const resources = Resources.for(gl);
  const model: ModelData = await resources.getModel(modelUri);

  const root = SceneEntity.instanciate(options.name ?? 'Model');
  root.transform.setLocalScale(model.unitScale, model.unitScale, model.unitScale);

  const nodes = model.nodes.map((node) => {
    const entity = SceneEntity.instanciate(node.name);
    const t = entity.transform;
    t.setLocalPosition(node.translation[0], node.translation[1], node.translation[2]);
    t.setLocalRotationQuat(node.rotation);
    t.setLocalScale(node.scale[0], node.scale[1], node.scale[2]);
    return entity;
  });
  model.nodes.forEach((node, i) => {
    nodes[i].transform.setParent(node.parent >= 0 ? nodes[node.parent].transform : root.transform);
  });

  const materials = await Promise.all(model.materials.map((m) => createMaterial(gl, modelUri, model, m, options.resolveImage)));

  for (const [i, node] of model.nodes.entries()) {
    if (node.mesh === undefined) continue;
    const material = node.material !== undefined ? materials[node.material] : await createMaterial(gl, modelUri, model);
    let renderer: MeshRendererBehaviour;
    if (node.skin !== undefined) {
      const skinned = new SkinnedMeshRendererBehaviour(gl);
      skinned.meshUri = modelPartUri(modelUri, 'mesh', node.mesh);
      skinned.skinUri = modelPartUri(modelUri, 'skin', node.skin);
      skinned.boneIds = model.skins[node.skin].joints.map((j) => nodes[j].uuid);
      renderer = skinned;
    } else {
      renderer = new MeshRendererBehaviour(gl);
      renderer.mesh = new Mesh();
      renderer.mesh.meshData = model.meshes[node.mesh];
    }
    renderer.shader = new LitShader(gl, material);
    nodes[i].addBehaviour(renderer);
  }

  if (model.clips.length) {
    const animator = new Animator();
    animator.clipUris = model.clips.map((_, i) => modelPartUri(modelUri, 'anim', i));
    root.addBehaviour(animator);
  }

  const entities = [root, ...nodes];
  if (options.scene) for (const e of entities) options.scene.addEntity(e);
  return { root, entities };
}

async function createMaterial(
  gl: WebGL2RenderingContext,
  modelUri: string,
  model: ModelData,
  source?: ModelMaterial,
  resolveImage?: InstantiateModelOptions['resolveImage'],
): Promise<LitMaterial> {
  const resources = Resources.for(gl);
  const material = new LitMaterial();
  material.name = source?.name ?? 'Material';
  const c = source?.color ?? [1, 1, 1, 1];
  material.color = new Color(c[0], c[1], c[2], c[3]);
  const image = async (index: number | undefined) => {
    const img = index === undefined ? undefined : model.images[index];
    if (!img) return undefined;
    if (img.data) return resources.getTexture(modelPartUri(modelUri, 'image', index!));
    const uri = img.path ? resolveImage?.(img.path, img) : undefined;
    if (!uri) { console.warn(`instantiateModel: texture "${img.path}" not found next to ${modelUri}.`); return undefined; }
    return resources.getTexture(uri);
  };
  material.mainTex = (await image(source?.albedo)) ?? (await resources.getTexture(BuiltinTextures.white));
  const normal = await image(source?.normal);
  if (normal) { material.normalTex = normal; material.normalMapStrength = 1; }
  const specular = await image(source?.specular);
  if (specular) material.specularTex = specular;
  const emissive = await image(source?.emissive);
  if (emissive) material.emissiveTex = emissive;
  material.roughness = 0.6;
  return material;
}

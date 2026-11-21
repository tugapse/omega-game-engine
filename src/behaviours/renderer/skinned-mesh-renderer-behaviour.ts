import { mat4 } from 'gl-matrix';
import { Transform } from '../../core/transform';
import { Resources } from '../../core/resources/resources';
import { ModelData, parseModelPartUri } from '../../core/model/model-data';
import { ShaderUniformsEnum } from '../../enums/shader-uniforms.enum';
import { JsonSerializedData } from '../../interfaces/json-serialized-data';
import { JOINT_TEXTURE_UNIT, ShadowAtlasPass } from '../../core/render/pass/shadow-atlas-pass';
import { MeshRendererBehaviour } from './mesh-renderer-behaviour';

/**
 * Draws a mesh deformed by a skeleton (linear blend skinning on the GPU).
 *
 * The mesh comes from a model file (`meshUri`, e.g. `asset://<id>#mesh/0`)
 * and is never saved in the scene. The bones are ordinary entities, listed
 * in joint order by `boneIds`; animating them (Animator, scripts, the
 * inspector) deforms the mesh.
 *
 * Each frame, before the shadow and geometry passes, the joint matrices
 * `inverse(meshWorld) * boneWorld * inverseBind` are written into a float
 * texture (4 RGBA texels per joint) that the `SKINNED` shaders read.
 */
export class SkinnedMeshRendererBehaviour extends MeshRendererBehaviour {
  static override instanciate(gl: WebGL2RenderingContext): SkinnedMeshRendererBehaviour {
    return new SkinnedMeshRendererBehaviour(gl);
  }
  protected override _className = 'SkinnedMeshRendererBehaviour';

  /** The mesh, as a model part URI: `<model uri>#mesh/<index>`. */
  public meshUri = '';
  /** The skin (bones and bind pose): `<model uri>#skin/<index>`. */
  public skinUri = '';
  /** The bone entities' uuids, in the skin's joint order. */
  public boneIds: string[] = [];

  private bones: (Transform | null)[] = [];
  private inverseBindMatrices: mat4[] = [];
  private _jointTexture: WebGLTexture | null = null;
  private jointData = new Float32Array(0);
  private loaded = false;
  private loading: Promise<void> | null = null;
  private readonly scratch = mat4.create();
  private readonly meshInverse = mat4.create();

  constructor(gl: WebGL2RenderingContext) {
    super(gl);
    this._serializationIgnoreKeys.push('bones', 'inverseBindMatrices', '_jointTexture', 'jointData', 'loaded', 'loading', 'scratch', 'meshInverse');
  }

  override get jointTexture(): WebGLTexture | null {
    return this.loaded ? this._jointTexture : null;
  }

  /** The mesh lives in the model file, not in the scene. */
  override get serializesMesh(): boolean {
    return false;
  }

  /** Resolves when the mesh and skin are loaded (or failed to). */
  whenLoaded(): Promise<void> {
    return this.loading ?? Promise.resolve();
  }

  protected override initializeShader(): void {
    if (!this.shader) return;
    if (!this.shader.defines.includes('SKINNED')) this.shader.defines.push('SKINNED');
    this.shader.initialize();
    this.loading = this.load().catch((error) => console.error(`SkinnedMeshRenderer: cannot load ${this.meshUri}`, error));
  }

  private async load(): Promise<void> {
    const meshPart = parseModelPartUri(this.meshUri);
    if (!meshPart || meshPart.kind !== 'mesh') throw new Error(`meshUri "${this.meshUri}" is not <model>#mesh/<n>`);
    const model: ModelData = await Resources.for(this._gl).getModel(meshPart.modelUri);
    const meshData = model.meshes[meshPart.index];
    if (!meshData) throw new Error(`${this.meshUri}: the model has no mesh ${meshPart.index}`);

    const skinPart = parseModelPartUri(this.skinUri);
    const skin = skinPart?.kind === 'skin' ? model.skins[skinPart.index] : undefined;
    this.inverseBindMatrices = skin?.inverseBindMatrices ?? [];

    this.mesh.meshData = meshData;
    this.shader!.initBuffers(this._gl, meshData);
    this.createJointTexture(Math.max(1, this.inverseBindMatrices.length));
    this.loaded = true;
  }

  private createJointTexture(joints: number): void {
    const gl = this._gl;
    this.jointData = new Float32Array(joints * 16);
    for (let j = 0; j < joints; j++) this.jointData.set(mat4.create(), j * 16);
    this._jointTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this._jointTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 4, joints, 0, gl.RGBA, gl.FLOAT, this.jointData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /** The bone transforms, found by uuid in the scene (bones load after this renderer). */
  private resolveBones(): void {
    const scene = this.parent?.scene;
    if (!scene) return;
    this.bones = this.boneIds.map((id) => scene.getEntitieByUuid(id)?.transform ?? null);
  }

  /** Writes this frame's joint matrices into the joint texture. */
  override beforeRender(): void {
    if (!this.loaded || !this._jointTexture) return;
    if (this.bones.length !== this.boneIds.length || this.bones.some((b) => !b)) this.resolveBones();

    // Matrices are recomputed lazily from the top: refresh the whole model
    // tree so a moved hip reaches every finger this frame.
    let top = this.parent.transform;
    while (top.parent) top = top.parent;
    top.updateMatrices();

    mat4.invert(this.meshInverse, this.parent.transform.modelMatrix);
    const count = Math.min(this.inverseBindMatrices.length, this.jointData.length / 16);
    for (let j = 0; j < count; j++) {
      const bone = this.bones[j];
      if (!bone) continue;
      mat4.multiply(this.scratch, this.meshInverse, bone.modelMatrix);
      mat4.multiply(this.scratch, this.scratch, this.inverseBindMatrices[j]);
      this.jointData.set(this.scratch, j * 16);
    }
    const gl = this._gl;
    gl.bindTexture(gl.TEXTURE_2D, this._jointTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 4, this.jointData.length / 16, gl.RGBA, gl.FLOAT, this.jointData);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  override draw(): void {
    if (!this.loaded || !this.shader?._shaderProgram) return;
    const gl = this._gl;
    this.shader.use();
    gl.activeTexture(gl.TEXTURE0 + JOINT_TEXTURE_UNIT);
    gl.bindTexture(gl.TEXTURE_2D, this._jointTexture);
    const location = gl.getUniformLocation(this.shader._shaderProgram, ShaderUniformsEnum.U_JOINT_TEXTURE);
    gl.uniform1i(location, JOINT_TEXTURE_UNIT);
    gl.activeTexture(gl.TEXTURE0);
    super.draw();
    ShadowAtlasPass.disableSkinAttributes(gl, this.shader._shaderProgram);
  }

  override destroy(): void {
    super.destroy();
    if (this._jointTexture) this._gl.deleteTexture(this._jointTexture);
    this._jointTexture = null;
    this.loaded = false;
  }

  override toJsonObject(): JsonSerializedData {
    const { mesh: _mesh, ...rest } = super.toJsonObject();
    return { ...rest, meshUri: this.meshUri, skinUri: this.skinUri, boneIds: [...this.boneIds] };
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.meshUri = jsonObject['meshUri'] ?? '';
    this.skinUri = jsonObject['skinUri'] ?? '';
    this.boneIds = [...(jsonObject['boneIds'] ?? [])];
  }
}

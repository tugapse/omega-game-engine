import { vec3 } from "gl-matrix";
import { RenderMeshBehaviour } from "../behaviours/renderer/render-mesh-behaviour";
import { EntityType } from "../enums/entity-type";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Camera } from "./camera";
import { GlEntity } from "./entity";
import { Light } from "./light";
import { SceneEntityBehaviour } from "../interfaces/scene-behaviour";

/**
  Represents a scene in the 3D world, acting as a container for entities and managing the main game loop operations like update and draw.
 * @augments {GlEntity}
 */
export class Scene extends GlEntity {
  /**
    The currently active scene instance.
   * @private
    
   * @type {Scene}
   */
  private static _currentScene: Scene;
  /**
    Gets the currently active scene instance.
   * @readonly
    
   * @type {Scene}
   */
  public static get currentScene(): Scene {
    return this._currentScene;
  }
  /**
    A flag indicating whether the scene's update loop is running.
   * @type {boolean}
   */
  public isRunning: boolean = false;
  /**
    The background color of the scene, in RGB format.
   * @type {vec3}
   */
  public color: vec3 = vec3.fromValues(0.2, 1, 0.2);
  /**
    The tag for the scene entity.
   * @override
   * @type {string}
   */
  public override tag: string = "Scene";
  /**
    A collection of behaviours specific to the scene.
   * @type {SceneEntityBehaviour[]}
   */
  public override behaviours: SceneEntityBehaviour[];
  /**
    The type of the entity, specifically set to SCENE.
   * @override
   * @type {number}
   */
  override entityType: number = EntityType.SCENE;
  /**
    An array of all entities within the scene.
   * @private
   * @type {GlEntity[]}
   */
  private _objects: GlEntity[];
  /**
    The WebGL2 rendering context.
   * @private
   * @type {WebGL2RenderingContext}
   */
  private gl!: WebGL2RenderingContext;
  /**
    The total elapsed time since the scene started.
   * @private
   * @type {number}
   */
  private ellapsedTime: number = 0;
  /**
    Gets the list of all entities in the scene.
   * @readonly
   * @type {GlEntity[]}
   */
  public get objects(): GlEntity[] {
    return this._objects;
  }
  /**
    Gets all light entities in the scene.
   * @readonly
   * @type {Light[]}
   */
  public get lights(): Light[] {
    return this._objects.filter(o => o instanceof Light) as Light[];
  }

  /**
    Creates an instance of Scene.
   */
  constructor() {
    super("Scene");
    this._objects = [];
    this.behaviours = [];
    if (!Scene._currentScene) {
      Scene._currentScene = this;
    }
  }

  /**
    Initializes all entities within the scene.
   * @override
   * @returns {void}
   */
  public override initialize(): void {
    for (const object of this.objects) {
      object.initialize();
    }
    super.initialize();
  }

  /**
    Updates the state of the scene and all its active entities.
   * @override
   * @param {number} ellapsed - The elapsed time in seconds since the last update.
   * @returns {void}
   */
  public override update(ellapsed: number): void {
    if (this.destroyed) return;
    Camera.mainCamera.update(ellapsed);
    if (!this.isRunning) return;
    this.behaviours.forEach(behaviour => behaviour.beforeUpdate(ellapsed));
    this.ellapsedTime += ellapsed;
    super.update(ellapsed);
    for (const object of this.objects.filter(e => e.active)) {
      object.update(ellapsed);
    }
    this.behaviours.forEach(behaviour => behaviour.afterUpdate());
  }

  /**
    Draws the scene, including clearing the buffer and rendering all visible entities.
   * @override
   * @returns {void}
   */
  public override draw(): void {
    if (this.destroyed || !this.gl || !Camera.mainCamera) return;
    this.behaviours.forEach(behaviour => behaviour.beforeDraw());
    this.gl.clearColor(this.color[0], Math.sin(this.ellapsedTime) * this.color[1], this.color[2], 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    for (const object of this.objects.filter(e => e.active && e.show)) {
      object.draw();
    }
    super.draw();
    this.behaviours.forEach(behaviour => behaviour.afterDraw());
  }

  /**
    Adds a new entity to the scene.
   * @param {GlEntity} entity - The entity to add.
   * @returns {void}
   */
  public addEntity(entity: GlEntity): void {
    if (this.destroyed) return;
    entity.scene = this;
    this._objects.push(entity);
    entity.initialize();
  }

  /**
    Adds a new scene-specific behaviour.
   * @override
   * @param {SceneEntityBehaviour} behaviour - The behaviour to add.
   * @returns {void}
   */
  override addBehaviour(behaviour: SceneEntityBehaviour): void {
    behaviour.parent = this;
    this.behaviours.push(behaviour);
    behaviour.initialize();
  }

  /**
    Sets the WebGL2 rendering context for the scene and its rendering behaviours.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {void}
   */
  public setGlRenderingContext(gl: WebGL2RenderingContext): void {
    this.gl = gl;
    this.behaviours.forEach(b => {
      if (b instanceof RenderMeshBehaviour) {
        const beh = b as RenderMeshBehaviour;
        beh.gl = gl;
      }
    });
  }

  /**
    Destroys the scene and all entities and behaviours within it.
   * @override
   * @returns {void}
   */
  public override destroy(): void {
    for (const child of this.lights) {
      child.destroy();
    }
    for (const child of this.objects) {
      child.destroy();
    }
    this._objects = [];
    super.destroy();
  }

  /**
    Deserializes the scene's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   * @returns {void}
   */
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    for (const entity of jsonObject['objects']) {
      this.addEntity(entity);
    }
  }

  /**
    Serializes the scene's state, including all entities and their mesh data, to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  public override toJsonObject(): JsonSerializedData {
    const meshMaps: { [key: string]: any } = {};
    const renderers = this.objects.filter(e => e.getBehaviour(RenderMeshBehaviour)).map(o => o.getBehaviour(RenderMeshBehaviour) as RenderMeshBehaviour);
    for (const renderer of renderers) {
      if (renderer.mesh) {
        meshMaps[renderer.mesh.meshData.uuid] = renderer.mesh.meshData.toJsonObject();
      } else {
        console.debug("No mesh for renderer", renderer);
      }
    }
    return {
      ...super.toJsonObject(),
      objects: this.objects.map(o => o.toJsonObject()),
      meshMaps: meshMaps,
    };
  }

  /**
    Sets this scene as the current active scene.
   * @returns {void}
   */
  public setCurrent(): void {
    Scene._currentScene = this;
  }

  /**
    Retrieves an entity by its name.
   * @param {string} name - The name of the entity to find.
   * @returns {GlEntity | undefined} - The found entity, or undefined.
   */
  public getEntitieByName(name: string): GlEntity | undefined {
    return this.objects.find(o => o.name === name);
  }

  /**
    Retrieves an entity by its unique identifier.
   * @param {string} uuid - The UUID of the entity to find.
   * @returns {GlEntity | undefined} - The found entity, or undefined.
   */
  public getEntitieByUuid(uuid: string): GlEntity | undefined {
    return this.objects.find(o => o.uuid === uuid);
  }

  /**
    Retrieves all entities with a specific tag.
   * @param {string} tag - The tag to filter by.
   * @returns {GlEntity[]} - An array of entities with the given tag.
   */
  public getEntitiesByTag(tag: string): GlEntity[] {
    return this.objects.filter(o => o.tag === tag);
  }

  /**
    Retrieves entities of a specific type from the collection.
   * @template T
   * @param {new (...args: any[]) => T} constructor - The constructor function of the type to filter by.
   * @returns {T[]} - An array of entities of the specified type.
   */
  public getEntities<T extends GlEntity>(constructor: new (...args: any[]) => T): T[] {
    return this._objects.filter((o): o is T => o instanceof constructor);
  }
}
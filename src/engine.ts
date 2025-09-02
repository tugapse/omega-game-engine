import { EntityBehaviour, RendererBehaviour } from "./behaviours";
import { CameraFlyBehaviour } from "./behaviours/camera-fly-behaviour";
import { RenderMeshBehaviour } from "./behaviours/renderer/render-mesh-behaviour";
import { SkyboxRenderer } from "./behaviours/renderer/skybox-renderer";
import { Transform } from "./core";
import { Color } from "./core/color";
import { MeshData } from "./core/mesh";
import { ObjectInstanciator } from "./core/object-instanciator";
import { Camera } from "./entities/camera";
import { GlEntity } from "./entities/entity";
import { Light, PointLight, SpotLight, DirectionalLight } from "./entities/light";
import { SceneManager } from "./entities/scene-manager";
import { ColorMaterial } from "./materials/color-material";
import { CubemapMaterial } from "./materials/cubemap-material";
import { LitMaterial } from "./materials/lit-material";
import { UnlitMaterial } from "./materials/unlit-material";
import { CubePrimitive } from "./primitives/cube-primitive";
import { QuadPrimitive } from "./primitives/quad-primitive";
import { SkyboxPrimitive } from "./primitives/skybox-primitive";
import { SpherePrimitive } from "./primitives/sphere-primitive";
import { TrianglePrimitive } from "./primitives/triangle-primitive";
import { LitShader } from "./shaders/lit-shader";
import { Shader } from "./shaders/shader";
import { SkyboxShader } from "./shaders/skybox-shader";
import { UnlitShader } from "./shaders/unlit-shader";

/**
  The main entry point for the engine. This class handles the initialization of core components and dependency registration.
 */
export class Engine {

  private canvas!: HTMLCanvasElement;
  /**
    Initializes the engine by registering all core dependencies.
    
   * @returns {void}
   */
  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.initializeEvents();
    this.registerDependencies();
  }

  private initializeEvents() {
    console.debug("HAndle canvas events here");
  }

  /**
    Registers all necessary classes and their instantiation methods with the SceneManager's dependency injection system.
   * @private
    
   * @returns {void}
   */
  private registerDependencies(): void {
    // Entities
    ObjectInstanciator.addDependency("GlEntity", (name: string, transform?: Transform) => new GlEntity(name, transform));

    
    ObjectInstanciator.addDependency("Camera", Camera.instanciate);
    ObjectInstanciator.addDependency("Light", Light.instanciate);
    ObjectInstanciator.addDependency("PointLight", PointLight.instanciate);
    ObjectInstanciator.addDependency("SpotLight", SpotLight.instanciate);
    ObjectInstanciator.addDependency("DirectionalLight", DirectionalLight.instanciate);
    ObjectInstanciator.addDependency("Color", () => new Color());
    ObjectInstanciator.addDependency("Transform", () => new Transform());

    // Geometry
    ObjectInstanciator.addDependency("MeshData", MeshData.instanciate);
    ObjectInstanciator.addDependency("CubePrimitive", CubePrimitive.instanciate);
    ObjectInstanciator.addDependency("QuadPrimitive", QuadPrimitive.instanciate);
    ObjectInstanciator.addDependency("SpherePrimitive", SpherePrimitive.instanciate);
    ObjectInstanciator.addDependency("SkyboxPrimitive", SkyboxPrimitive.instanciate);
    ObjectInstanciator.addDependency("TrianglePrimitive", TrianglePrimitive.instanciate);

    // Shaders
    ObjectInstanciator.addDependency("Shader", Shader.instanciate);
    ObjectInstanciator.addDependency("SkyboxShader", SkyboxShader.instanciate);
    ObjectInstanciator.addDependency("UnlitShader", UnlitShader.instanciate);
    ObjectInstanciator.addDependency("LitShader", LitShader.instanciate);

    // Behaviours (Renderers)
    ObjectInstanciator.addDependency("EntityBehaviour", EntityBehaviour.instanciate);
    ObjectInstanciator.addDependency("RendererBehaviour", RendererBehaviour.instanciate);
    ObjectInstanciator.addDependency("RenderMeshBehaviour", RenderMeshBehaviour.instanciate);
    ObjectInstanciator.addDependency("SkyboxRenderer", SkyboxRenderer.instanciate);

    // Materials
    ObjectInstanciator.addDependency("ColorMaterial", ColorMaterial.instanciate);
    ObjectInstanciator.addDependency("UnlitMaterial", UnlitMaterial.instanciate);
    ObjectInstanciator.addDependency("LitMaterial", LitMaterial.instanciate);
    ObjectInstanciator.addDependency("CubemapMaterial", CubemapMaterial.instanciate);

    // Other Behaviours
    ObjectInstanciator.addDependency("CameraFlyBehaviour", CameraFlyBehaviour.instanciate);

    Shader.preFetchFunctionsGlsl();
  }
}
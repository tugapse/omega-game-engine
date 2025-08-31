import { CameraFlyBehaviour } from "./behaviours/camera-fly-behaviour";
import { RenderMeshBehaviour } from "./behaviours/renderer/render-mesh-behaviour";
import { SkyboxRenderer } from "./behaviours/renderer/skybox-renderer";
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
  /**
    Initializes the engine by registering all core dependencies.
    
   * @returns {void}
   */
  public static initialize(): void {
    this.registerDependencies();
  }

  /**
    Registers all necessary classes and their instantiation methods with the SceneManager's dependency injection system.
   * @private
    
   * @returns {void}
   */
  private static registerDependencies(): void {
    // Entities
    ObjectInstanciator.addDependency(GlEntity.name, GlEntity.instanciate);
    ObjectInstanciator.addDependency(Camera.name, Camera.instanciate);
    ObjectInstanciator.addDependency(Light.name, Light.instanciate);
    ObjectInstanciator.addDependency(PointLight.name, PointLight.instanciate);
    ObjectInstanciator.addDependency(SpotLight.name, SpotLight.instanciate);
    ObjectInstanciator.addDependency(DirectionalLight.name, DirectionalLight.instanciate);
    ObjectInstanciator.addDependency(Color.name, () => new Color());

    // Geometry
    ObjectInstanciator.addDependency(MeshData.name, MeshData.instanciate);
    ObjectInstanciator.addDependency(CubePrimitive.name, CubePrimitive.instanciate);
    ObjectInstanciator.addDependency(QuadPrimitive.name, QuadPrimitive.instanciate);
    ObjectInstanciator.addDependency(SpherePrimitive.name, SpherePrimitive.instanciate);
    ObjectInstanciator.addDependency(SkyboxPrimitive.name, SkyboxPrimitive.instanciate);
    ObjectInstanciator.addDependency(TrianglePrimitive.name, TrianglePrimitive.instanciate);

    // Shaders
    ObjectInstanciator.addDependency(Shader.name, Shader.instanciate);
    ObjectInstanciator.addDependency(SkyboxShader.name, SkyboxShader.instanciate);
    ObjectInstanciator.addDependency(UnlitShader.name, UnlitShader.instanciate);
    ObjectInstanciator.addDependency(LitShader.name, LitShader.instanciate);

    // Behaviours (Renderers)
    ObjectInstanciator.addDependency(RenderMeshBehaviour.name, RenderMeshBehaviour.instanciate);
    ObjectInstanciator.addDependency(SkyboxRenderer.name, SkyboxRenderer.instanciate);

    // Materials
    ObjectInstanciator.addDependency(ColorMaterial.name, ColorMaterial.instanciate);
    ObjectInstanciator.addDependency(UnlitMaterial.name, UnlitMaterial.instanciate);
    ObjectInstanciator.addDependency(LitMaterial.name, LitMaterial.instanciate);
    ObjectInstanciator.addDependency(CubemapMaterial.name, CubemapMaterial.instanciate);

    // Other Behaviours
    ObjectInstanciator.addDependency(CameraFlyBehaviour.name, CameraFlyBehaviour.instanciate);

    Shader.preFetchFunctionsGlsl();
  }
}
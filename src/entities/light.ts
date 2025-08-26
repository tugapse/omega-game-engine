
import { vec3 } from "gl-matrix";
import { Color } from "../core/color";
import { Transform } from "../core/transform";
import { Vector3 } from "../core/vector";
import { EntityType } from "../enums/entity-type";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { GlEntity } from "./entity";


export class LightAttenuation { constant!: number; linear!: number; quadratic!: number }
export class LightConeAngles { inner!: number; outer!: number; }

export class Light extends GlEntity {

  public override entityType: EntityType = EntityType.LIGHT_AMBIENT;
  public color: Color;

  constructor(name: string) {
    super(name);
    this.color = new Color(0.2, 0.2, 0.2, 1);
    this.entityType = EntityType.LIGHT_AMBIENT;
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      color: this.color.toJsonObject()
    }
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.color = Color.createFromJsonData(jsonObject['color']);
  }

  static override instanciate(name?: string, transform?: Transform): Light {
    return new Light(name || "Light");
  }
}

export class DirectionalLight extends Light {

  public get direction() { return this.transform.rotation }
  public override entityType: EntityType = EntityType.LIGHT_DIRECTIONAL;

  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_DIRECTIONAL;
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),

    }
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);

  }

  static override instanciate(name?: string, transform?: Transform): DirectionalLight {
    return new DirectionalLight(name || "Directional Light");
  }
}

export class PointLight extends Light {
  public override entityType: EntityType = EntityType.LIGHT_POINT;
  public attenuation!: LightAttenuation;



  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_POINT;
    this.attenuation = new LightAttenuation();
  }


  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      attenuation: this.attenuation
    }
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.attenuation = jsonObject['attenuation'];
  }

  static override instanciate(name?: string, transform?: Transform): PointLight {
    return new PointLight(name || "Light");
  }
}

export class SpotLight extends Light {
  public override entityType: EntityType = EntityType.LIGHT_SPOT;
  public coneAngles!: LightConeAngles;
  public attenuation!: LightAttenuation;
  public get direction() { return this.transform.rotation }

  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_SPOT;
    this.coneAngles = new LightConeAngles();
    this.attenuation = new LightAttenuation();
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      coneAngles: this.coneAngles,
      attenuation: this.attenuation,
    }
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.coneAngles = jsonObject['coneAngles'];
    this.attenuation = jsonObject['attenuation'];
  }

  static override instanciate(name?: string, transform?: Transform): SpotLight {
    return new SpotLight(name || "Light");
  }
}


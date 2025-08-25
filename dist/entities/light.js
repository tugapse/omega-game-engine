import { Color } from "../core/color";
import { Vector3 } from "../core/vector";
import { EntityType } from "../enums/entity-type";
import { GlEntity } from "./entity";
export class LightAttenuation {
}
export class LightConeAngles {
}
export class Light extends GlEntity {
    constructor(name) {
        super(name);
        this.entityType = EntityType.LIGHT_AMBIENT;
        this.color = new Color(0.2, 0.2, 0.2, 1);
        this.entityType = EntityType.LIGHT_AMBIENT;
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            color: this.color.toJsonObject()
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.color = Color.createFromJsonData(jsonObject['color']);
    }
    static instanciate(name, transform) {
        return new Light(name || "Light");
    }
}
export class DirectionalLight extends Light {
    constructor(name) {
        super(name);
        this.entityType = EntityType.LIGHT_DIRECTIONAL;
        this.entityType = EntityType.LIGHT_DIRECTIONAL;
        this.direction = new Vector3();
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            direction: this.direction.toJsonObject()
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.direction.fromJson(jsonObject['direction']);
    }
    static instanciate(name, transform) {
        return new DirectionalLight(name || "Directional Light");
    }
}
export class PointLight extends Light {
    constructor(name) {
        super(name);
        this.entityType = EntityType.LIGHT_POINT;
        this.entityType = EntityType.LIGHT_POINT;
        this.attenuation = new LightAttenuation();
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            attenuation: this.attenuation
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.attenuation = jsonObject['attenuation'];
    }
    static instanciate(name, transform) {
        return new PointLight(name || "Light");
    }
}
export class SpotLight extends Light {
    constructor(name) {
        super(name);
        this.entityType = EntityType.LIGHT_SPOT;
        this.entityType = EntityType.LIGHT_SPOT;
        this.direction = new Vector3();
        this.coneAngles = new LightConeAngles();
        this.attenuation = new LightAttenuation();
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            coneAngles: this.coneAngles,
            attenuation: this.attenuation,
            direction: this.direction.toJsonObject()
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.direction = new Vector3();
        this.direction.fromJson(jsonObject['direction']);
        this.coneAngles = jsonObject['coneAngles'];
        this.attenuation = jsonObject['attenuation'];
    }
    static instanciate(name, transform) {
        return new SpotLight(name || "Light");
    }
}

export var EntityType;
(function (EntityType) {
    EntityType[EntityType["STATIC"] = -1] = "STATIC";
    EntityType[EntityType["LIGHT_AMBIENT"] = 0] = "LIGHT_AMBIENT";
    EntityType[EntityType["LIGHT_DIRECTIONAL"] = 1] = "LIGHT_DIRECTIONAL";
    EntityType[EntityType["LIGHT_POINT"] = 2] = "LIGHT_POINT";
    EntityType[EntityType["LIGHT_SPOT"] = 3] = "LIGHT_SPOT";
    EntityType[EntityType["CAMERA"] = 4] = "CAMERA";
    EntityType[EntityType["SCENE"] = 5] = "SCENE";
})(EntityType || (EntityType = {}));

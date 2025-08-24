import { ColorMaterial } from "./color-material";
export class CubemapMaterial extends ColorMaterial {
    constructor() {
        super(...arguments);
        this.rightSideUri = "assets/images/skybox/blue/right.jpeg";
        this.leftSideUri = "assets/images/skybox/blue/left.jpeg";
        this.topSideUri = "assets/images/skybox/blue/top.jpeg";
        this.bottomSideUri = "assets/images/skybox/blue/bottom.jpeg";
        this.backSideUri = "assets/images/skybox/blue/back.jpeg";
        this.frontSideUri = "assets/images/skybox/blue/front.jpeg";
    }
    fromJson(jsonObject) {
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            rightSideUri: this.rightSideUri,
            leftSideUri: this.leftSideUri,
            topSideUri: this.topSideUri,
            bottomSideUri: this.bottomSideUri,
            backSideUri: this.backSideUri,
            frontSideUri: this.frontSideUri
        };
    }
    static instanciate() {
        return new CubemapMaterial();
    }
}

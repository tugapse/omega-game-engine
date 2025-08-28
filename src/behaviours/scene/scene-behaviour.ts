import { EntityBehaviour } from "../entity-behaviour";

export interface SceneEntityBehaviour extends EntityBehaviour {

    beforeUpdate(ellapsed: number): void;

    afterUpdate(): void;

    beforeDraw(): void;

    afterDraw(): void;

}
import { GameObjectType } from "../gameobject/gameObject";
import Config from "./config";

export default interface SceneConfig extends Config {
    models: SceneModel[];
    objects: (SceneObject | KartCheckpointObject | KartSpawnPointObject)[];
    metadata: KartSceneMetadata;
}

export interface SceneModel {
    path: string;
    position: {
        x: number;
        y: number;
        z: number;
    }
    rotation: {
        x: number;
        y: number;
        z: number;
    }
    scale: {
        x: number;
        y: number;
        z: number;
    }
}

export interface SceneObject {
    id: number;
    name: string;
    config: number;
    position: {
        x: number;
        y: number;
        z: number;
    }
    rotation: {
        x: number;
        y: number;
        z: number;
    }
    scale: {
        x: number;
        y: number;
        z: number;
    }
    type: GameObjectType;
}

export interface KartCheckpointObject extends SceneObject {
    isStart: boolean;
    order: number;
    isSafeRespawnCandidate: boolean;
    canBeSkipped: boolean;
}

export interface KartSpawnPointObject extends SceneObject {
    order: number;
}

export interface KartSceneMetadata {
    checkpoints: number[]
    spawnPoints: number[]
}
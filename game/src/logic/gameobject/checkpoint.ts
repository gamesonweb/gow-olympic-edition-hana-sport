import GameObject, {GameObjectType} from "./gameObject";
import {KartCheckpointObject} from "../config/scene";
import {Vector3} from "@babylonjs/core";
import Character from "./character";
import CharacterConfig from "../config/gameobject/character";

export class Checkpoint extends GameObject {
    private _isStart: boolean;
    private _order: number;
    private _isSafeRespawnCandidate: boolean;
    private _canBeSkipped: boolean;

    public get type(): GameObjectType {
        return GameObjectType.Checkpoint;
    }

    load(data: KartCheckpointObject) {
        super.load(data);
        this._isStart = data.isStart;
        this._order = data.order;
        this._isSafeRespawnCandidate = data.isSafeRespawnCandidate;
        this._canBeSkipped = data.canBeSkipped;
    }

    public get canBeSkipped(): boolean {
        return this._canBeSkipped;
    }

    private _isInsideBox(position: Vector3): boolean {
        const dist = position.subtract(this.position);
        const x = Math.abs(dist.x);
        const y = Math.abs(dist.y);
        const z = Math.abs(dist.z);
        return x <= Math.abs(this.scale.x / 2) && y <= Math.abs(this.scale.y / 2) && z <= Math.abs(this.scale.z / 2);
    }

    update(t: number) {
        const objects = this.level.gameObjectManager.objects;
        for (const [objectId, object] of objects) {
            if (object.type == GameObjectType.Character) {
                const character = object as Character;
                if (this.isInside(character.position, character.rotation, (character.config as CharacterConfig).movement.collider)) {
                    this.level.battle.onCheckpointReached(character.playerIndex, this.id);
                }
            }
        }
    }

    public isInside(position: Vector3, rotation: Vector3, collisionBox: { x: number, y: number, z: number }): boolean {
        const boundingBox = [
            new Vector3(-collisionBox.x / 2, 0, -collisionBox.z / 2),
            new Vector3(-collisionBox.x / 2, 0, collisionBox.z / 2),
            new Vector3(collisionBox.x / 2, 0, collisionBox.z / 2),
            new Vector3(collisionBox.x / 2, 0, -collisionBox.z / 2)
        ];
        for (let i = 0; i < boundingBox.length; i++) {
            boundingBox[i].rotateByQuaternionAroundPointToRef(rotation.toQuaternion(), Vector3.Zero(), boundingBox[i]);
            boundingBox[i].addInPlace(position);
        }
        for (let i = 0; i < boundingBox.length; i++) {
            if (this._isInsideBox(boundingBox[i])) {
                return true;
            }
        }
        return false;
    }
}
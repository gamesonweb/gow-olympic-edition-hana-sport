import ConfigTable from "../config/table";
import Level from "../level/level";
import GameObject, { GameObjectType } from "./gameObject";
import Character from "./character";
import {Checkpoint} from "./checkpoint";
import {SpawnPoint} from "./spawnPoint";
import {SceneObject} from "../config/scene";

export default class GameObjectManager {
    // declare 2 events: onNewObject and onRemoveObject
    public onNewObject: (object: GameObject) => void = () => {};
    public onRemoveObject: (object: GameObject) => void = () => {};

    private readonly _level: Level;
    private readonly _objects: Map<number, GameObject> = new Map();

    private _nextId: number = 0;

    constructor(level: Level) {
        this._level = level;
    }

    public get level(): Level {
        return this._level;
    }
    public get objects(): Map<number, GameObject> {
        return this._objects;
    }

    public addObject(object: GameObject): void {
        if (object.id == -1) {
            object.id = this._nextId++;
        } else {
            this._nextId = Math.max(this._nextId, object.id + 1);
        }
        if (this._objects.has(object.id)) {
            throw new Error(`Object with id ${object.id} already exists.`);
        }
        console.log(`Adding object ${object.id}`);
        this._objects.set(object.id, object);
        this.onNewObject(object);
    }

    public removeObject(object: GameObject): void {
        if (!this._objects.has(object.id)) {
            throw new Error(`Object with id ${object.id} does not exist.`);
        }
        object.destroy();
        this._objects.delete(object.id);
        this.onRemoveObject(object);
    }

    public getObject(id: number): GameObject {
        return this._objects.get(id);
    }

    public destroy(): void {
        this._objects.forEach((object) => {
            object.destroy();
        });
        this._objects.clear();
        this._nextId = 0;
    }

    public load(data: SceneObject[]): void {
        this.destroy();

        for (let i = 0; i < data.length; i++) {
            const object = data[i];
            const type = object.type;
            const configId = object.config;
            const gameObject = this.createObject(type, configId);
            gameObject.id = object.id;
            gameObject.load(object);
            this.addObject(gameObject);
        }
    }

    public update(t: number): void {
        this._objects.forEach((object) => {
            object.update(t);
        });
    }

    private createObject(type: GameObjectType, configId: number): GameObject {
        switch (type) {
            case GameObjectType.Character:
                return new Character(ConfigTable.getCharacter(configId), this._level, 0);
            case GameObjectType.Checkpoint:
                return new Checkpoint({ id: 10000000, name: "Dummy_Checkpoint" }, this._level);
            case GameObjectType.SpawnPoint:
                return new SpawnPoint({ id: 10000001, name: "Dummy_SpawnPoint" }, this._level);
            default:
                throw new Error(`Unknown game object type: ${type}`);
        }
    }
}
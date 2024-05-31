import Config from "../config/config";
import Level from "../level/level";
import Component, { ComponentType } from "./component/component";
import GameObjectManager from "./manager";
import {Vector3} from "@babylonjs/core";
import {SceneObject} from "../config/scene";

export default abstract class GameObject {
    private readonly _level: Level;
    private readonly _components: Map<ComponentType, Component> = new Map();
    private readonly _config: Config;

    private _id: number;
    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;

    constructor(config: Config, level: Level) {
        this._level = level;
        this._config = config;
        this._id = -1;
        this._position = Vector3.Zero();
        this._rotation = Vector3.Zero();
        this._scale = Vector3.One();
    }

    public destroy(): void {
        this._components.forEach((component) => {
            component.destroy();
        });
        this._components.clear();
    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get level(): Level {
        return this._level;
    }

    public get gameObjectManager(): GameObjectManager {
        return this._level.gameObjectManager;
    }

    public get config(): Config {
        return this._config;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(position: Vector3) {
        this._position.copyFrom(position);
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public set rotation(rotation: Vector3) {
        this._rotation.copyFrom(rotation);
    }

    public get scale(): Vector3 {
        return this._scale;
    }

    public get center(): Vector3 {
        return this._position;
    }

    public getComponent<T extends Component>(s: new (parent: GameObject) => T): T {
        const type = s.prototype.type;
        if (!this._components.has(type)) {
            throw new Error(`Component of type ${type} does not exist.`);
        }
        return this._components.get(type) as T;
    }

    public findComponent<T extends Component>(s: new (parent: GameObject) => T): T {
        const type = s.prototype.type;
        if (!this._components.has(type)) {
            return null;
        }
        return this._components.get(type) as T;
    }

    public addComponent(component: Component): void {
        if (this._components.has(component.type)) {
            throw new Error(`Component of type ${component.type} already exists.`);
        }
        this._components.set(component.type, component);
    }

    public update(t: number): void {
        this._components.forEach((component) => {
            component.update(t);
        });
    }

    public load(data: SceneObject) {
        this._id = data.id;
        this._position = new Vector3(data.position.x, data.position.y, data.position.z);
        this._rotation = new Vector3(-data.rotation.x * Math.PI / 180, data.rotation.y * Math.PI / 180, data.rotation.z * Math.PI / 180);
        this._scale = new Vector3(-data.scale.x, data.scale.y, data.scale.z);
    }

    public abstract get type(): GameObjectType;
}

export enum GameObjectType {
    Character = 0,
    Checkpoint = 1,
    SpawnPoint = 2,
}
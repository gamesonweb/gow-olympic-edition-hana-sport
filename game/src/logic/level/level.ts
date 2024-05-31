import GameObjectManager from "../gameobject/manager";
import SceneConfig, {SceneObject} from "../config/scene";
import {Battle} from "../battle";
import Scene from "../../scenes/scene";

export default class Level {
    private readonly _gameObjectManager: GameObjectManager;
    private readonly _battle: Battle;
    private readonly _sceneConfig: SceneConfig;
    private readonly _scene: Scene;

    constructor(config: SceneConfig, scene: Scene) {
        this._sceneConfig = config;
        this._battle = new Battle(this);
        this._gameObjectManager = new GameObjectManager(this);
        this._scene = scene;
    }

    public get gameObjectManager(): GameObjectManager {
        return this._gameObjectManager;
    }

    public get sceneConfig(): SceneConfig {
        return this._sceneConfig;
    }

    public get metadata() {
        return this._sceneConfig.metadata;
    }

    public get battle(): Battle {
        return this._battle;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public destroy() {
        this._gameObjectManager.destroy();
    }

    public load(data: SceneObject[]) {
        this._gameObjectManager.load(data);
    }

    public update(t: number) {
        this._battle.update(t);
        this._gameObjectManager.update(t);
    }
}
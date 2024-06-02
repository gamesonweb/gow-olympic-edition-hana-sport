import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene as BScene } from "@babylonjs/core/scene";
import ISceneComponent from "../management/component/interface";
import InputManager from "../management/inputmanager";
import MeshProvider from "../management/meshprovider";

export default abstract class Scene extends BScene {
  private _sceneComponents: ISceneComponent[] = [];

  constructor(engine: Engine) {
    super(engine);
    engine.onDisposeObservable.add(() => {
        this.destroy();
    });
  }

  public async init(): Promise<void> {
    await this.whenReadyAsync();
    window.addEventListener("resize", () => {
      this.getEngine().resize();
    });
    InputManager.init(this);
    MeshProvider.activeScene = this;
  }

  public update() {
    this.render();

    const t = Math.min(this.getEngine().getDeltaTime() / 1000, 0.1);
    this._sceneComponents.forEach((component) => component.update(t));

    MeshProvider.instance.executeQueue();
  }

  public destroy() {
    this._sceneComponents.forEach((component) => component.destroy());
    this._sceneComponents = [];
  }

  public addComponent(component: ISceneComponent) {
    this._sceneComponents.push(component);
  }

  public getComponent<T extends ISceneComponent>(type: new (...args: any[]) => T): T {
    return this._sceneComponents.find((component) => component instanceof type) as T;
  }
}

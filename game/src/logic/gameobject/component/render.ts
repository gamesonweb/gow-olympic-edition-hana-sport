import { AbstractMesh, Vector3 } from "@babylonjs/core";
import MeshProvider, { MeshAsyncHandle } from "../../../management/meshprovider";
import RenderConfig from "../../config/component/render";
import GameObject from "../gameObject";
import AnimationComponent from "./animation";
import Component, { ComponentType } from "./component";
import {EventListT} from "../../util/eventList";

export default class RenderComponent extends Component {
    private _handle: MeshAsyncHandle;
    private _mesh: AbstractMesh;

    public onLoaded: EventListT<AbstractMesh> = new EventListT<AbstractMesh>();

    private _hide: boolean = false;
    private _offset: Vector3 = Vector3.Zero();

    public constructor(parent: GameObject, config: RenderConfig = null) {
        super(parent);
        this._handle = MeshProvider.instance.load(config.model);
        this._handle.onLoaded = (result) => {
            this._mesh = result.meshes[0];

            result.animationGroups.forEach((animationGroup) => {
                animationGroup.targetedAnimations.forEach((animation) => {
                    animation.animation.enableBlending = true;
                    animation.animation.blendingSpeed = 0.25;
                });
            });

            // disable pickability
            this._mesh.isPickable = false;
            for (const mesh of result.meshes) {
                mesh.isPickable = false;
            }

            // apply scale
            this._mesh.scaling = new Vector3(config.scale, config.scale, config.scale).multiply(this.parent.scale);
            this._offset = new Vector3(config.offset.x, config.offset.y, config.offset.z);

            const animationComponent = this.parent.findComponent(AnimationComponent);
            if (animationComponent) {
                animationComponent.setGroups(result.animationGroups);
            }

            this.updateRender();
            this.onLoaded.trigger(this._mesh);
        };
    }

    public destroy(): void {
        super.destroy();
        if (this._mesh) {
            this._mesh.dispose();
            this._mesh = null;
        }
        if (this._handle) {
            this._handle.dispose();
            this._handle = null;
        }
    }
    
    public get type(): ComponentType {
        return ComponentType.Render;
    }

    public update(t: number): void {
        this.updateRender();
    }

    public updateRender(): void {
        if (this._mesh) {
            this._mesh.rotation = this.parent.rotation.clone();

            const offsetRotated = this._offset.rotateByQuaternionAroundPointToRef(this.parent.rotation.toQuaternion(), Vector3.Zero(), new Vector3());
            this._mesh.position = this.parent.position.clone().add(offsetRotated);
        }
    }

    public hide() {
        this._hide = true;
    }

    public show() {
        this._hide = false;
    }
}
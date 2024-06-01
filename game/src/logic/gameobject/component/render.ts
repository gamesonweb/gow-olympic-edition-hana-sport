import { AbstractMesh, Vector3 } from "@babylonjs/core";
import MeshProvider, { MeshAsyncHandle } from "../../../management/meshprovider";
import RenderConfig from "../../config/component/render";
import GameObject from "../gameObject";
import Component, { ComponentType } from "./component";
import {EventListT} from "../../util/eventList";
import MovementComponent from "./movement";

export default class RenderComponent extends Component {
    private _handle: MeshAsyncHandle;
    private _mesh: AbstractMesh;

    public onLoaded: EventListT<AbstractMesh> = new EventListT<AbstractMesh>();

    private _hide: boolean = false;
    private _offset: Vector3 = Vector3.Zero();
    private _driftDirection: number = 0;

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

            this.updateRender(1);
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
        this.updateRender(t);
    }

    public updateRender(t: number): void {
        if (this._mesh) {
            const targetRotation = this.parent.rotation.clone();
            const movementComponent = this.parent.findComponent(MovementComponent);

            this._driftDirection = RenderComponent._lerp(this._driftDirection, movementComponent?.driftDirection ?? 0, t * 5);

            targetRotation.y += Math.PI / 4 * 0.75 * Math.min(1, this._driftDirection);

            const offsetRotated = this._offset.rotateByQuaternionAroundPointToRef(this.parent.rotation.toQuaternion(), Vector3.Zero(), new Vector3());
            this._mesh.position = this.parent.position.clone().add(offsetRotated);
            this._mesh.rotation = targetRotation;
        }
    }

    private static _lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Math.min(1, Math.max(0, t));
    }

    public hide() {
        this._hide = true;
    }

    public show() {
        this._hide = false;
    }
}
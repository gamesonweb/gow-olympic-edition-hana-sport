import {Camera, Ray, Vector3} from "@babylonjs/core";
import GameObject from "../../logic/gameobject/gameObject";
import WorldScene from "../../scenes/world";
import ISceneComponent from "./interface";
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera";

export default class PlayerCamera implements ISceneComponent {
    private _scene: WorldScene;
    private _camera: TargetCamera;
    private _target: GameObject | null;
    private _offset: Vector3;
    private _targetOffset: Vector3;

    private _speed: number;

    private _tracking: boolean;

    constructor(scene: WorldScene, camera: TargetCamera, offset: Vector3, targetOffset: Vector3, speed: number = 10) {
        this._scene = scene;
        this._camera = camera;
        this._camera.mode = Camera.PERSPECTIVE_CAMERA;
        this._camera.fov = 0.6;
        this._camera.position = offset;
        this._camera.parent = null;

        this._target = null;
        this._offset = offset;
        this._targetOffset = targetOffset;
        this._speed = speed;
    }

    public update(t: number): void {
        if (!this._tracking) {
            return;
        }

        if (this._target) {
            const targetPosition = this._target.position;

            const targetCameraPosition = this._calculateCameraPosition(this._offset);
            // raycast to check if camera is inside a wall
            const ray = targetCameraPosition.subtract(targetPosition);
            const raycast = this._scene.pickWithRay(new Ray(targetPosition, ray.normalizeToNew(), ray.length() - 0.5));
            if (raycast.hit) {
                if (raycast.pickedPoint.clone().subtract(targetPosition).length() < 1.2) {
                    targetCameraPosition.copyFrom(this._calculateCameraPosition(new Vector3(0, 7, -6)))
                } else {
                    targetCameraPosition.copyFrom(raycast.pickedPoint);
                }
            }

            const cameraPosition = this._camera.position;
            cameraPosition.x = PlayerCamera._lerp(cameraPosition.x, targetCameraPosition.x, t * this._speed);
            cameraPosition.y = PlayerCamera._lerp(cameraPosition.y, targetCameraPosition.y, t * this._speed / 3);
            cameraPosition.z = PlayerCamera._lerp(cameraPosition.z, targetCameraPosition.z, t * this._speed);
            this._camera.position = cameraPosition;

            this._camera.setTarget(targetPosition.clone().add(this._targetOffset));
        } else {
            console.warn('No target set for player camera');
        }
    }

    private _calculateCameraPosition(offset: Vector3): Vector3 {
        const targetRotation = this._target.rotation.toQuaternion();
        const targetPosition = this._target.position;
        const offsetWithRotation = offset.rotateByQuaternionAroundPointToRef(targetRotation, Vector3.Zero(), new Vector3());
        offsetWithRotation.y = offset.y;
        return  targetPosition.add(offsetWithRotation);
    }

    public get tracking(): boolean {
        return this._tracking;
    }

    public set tracking(tracking: boolean) {
        this._tracking = tracking;
        if (this._target) {
            const targetRotation = this._target.rotation.toQuaternion();
            const targetPosition = this._target.position;

            const offsetWithRotation = this._offset.rotateByQuaternionAroundPointToRef(targetRotation, Vector3.Zero(), new Vector3());
            offsetWithRotation.y = this._offset.y;

            const finalPosition = targetPosition.add(offsetWithRotation);
            this._camera.position = finalPosition;
            this._camera.setTarget(targetPosition.clone().add(this._targetOffset));
        }
    }

    public get enabled(): boolean {
        return this._camera.isEnabled();
    }

    public set enabled(enabled: boolean) {
        this._camera.setEnabled(enabled);
    }

    public get camera(): TargetCamera {
        return this._camera;
    }

    public set target(target: GameObject) {
        this._target = target;
        this.tracking = target !== null;
    }

    public destroy(): void {
        this._camera = null;
        this._target = null;
    }

    private static _lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Math.min(1, Math.max(0, t));
    }
}
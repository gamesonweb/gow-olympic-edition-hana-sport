import {Vector2} from "@babylonjs/core/Maths/math.vector";
import MovementConfig from "../../config/component/movement";
import GameObject from "../gameObject";
import Component, {ComponentType} from "./component";
import {Physics6DoFConstraint, PhysicsAggregate, PhysicsShapeType, Ray, TransformNode, Vector3} from "@babylonjs/core";

class MovementComponent extends Component {
    public onMove: (speedRate: number) => void = () => { };

    protected _config: MovementConfig;
    protected _physicsObject: TransformNode;
    private _physicsAggregate: PhysicsAggregate;
    private _speedRate: number = 0;
    private _rotationRate: number = 0;

    public input = new MovementInput();

    constructor(parent: GameObject, config: MovementConfig = null) {
        super(parent);
        this._config = config;

        const transformNode = new TransformNode("MovementComponent", this.parent.level.scene);
        this._physicsObject = transformNode;
    }

    public get type(): ComponentType {
        return ComponentType.Movement;
    }

    public update(t: number): void {
        this.parent.position = this._physicsObject.position;
        this.parent.rotation = this._physicsObject.rotationQuaternion.toEulerAngles();

        // raycast to check if grounded
        const downRotation = Vector3.TransformNormal(Vector3.Down(), this._physicsObject.getWorldMatrix());

        const raycast = this.parent.level.scene.getPhysicsEngine().raycast(this.parent.position, this.parent.position.add(downRotation.scale(this._config.collider.y + 0.1)));
        const isGrounded = raycast.hasHit;

        // console.log(isGrounded + ": " + this.parent.position + " " + this._config.collider.y + " " + downRotation);

        if (!isGrounded) {
            const angularVelocity = this._physicsAggregate.body.getAngularVelocity();
            angularVelocity.x = Math.sign(angularVelocity.x) * Math.min(Math.abs(angularVelocity.x), 2);
            angularVelocity.z = Math.sign(angularVelocity.z) * Math.min(Math.abs(angularVelocity.z), 2);
            this._physicsAggregate.body.setAngularVelocity(angularVelocity);
        } else {
            const currentVelocity = this._physicsAggregate.body.getLinearVelocity();
            const direction = this.input.axis.clone();
            direction.x = MovementComponent.clamp(direction.x, -1, 1);
            direction.y = MovementComponent.clamp(direction.y, -1, 1);
            const targetSpeed = direction.y;

            let targetSpeedLerpCoefficient;
            if (Math.abs(targetSpeed) < 0.05) {
                targetSpeedLerpCoefficient = this._config.deceleration;
            } else if (Math.sign(targetSpeed) != Math.sign(currentVelocity.y)) {
                targetSpeedLerpCoefficient = this._config.brake;
            } else {
                targetSpeedLerpCoefficient = this._config.acceleration;
            }

            const forwardVelocity = new Vector2(currentVelocity.x, currentVelocity.z);
            const forwardSpeed = forwardVelocity.length() * Math.sign(this._speedRate);

            this._speedRate = MovementComponent.lerp(forwardSpeed / this._config.speed, targetSpeed, t * targetSpeedLerpCoefficient);

            const rotation = this.parent.rotation;
            const forward = new Vector3(Math.sin(rotation.y), 0, Math.cos(rotation.y));
            const targetVelocity = forward.scale(this._config.speed * this._speedRate);

            currentVelocity.x = targetVelocity.x;
            currentVelocity.z = targetVelocity.z;

            this._physicsAggregate.body.setLinearVelocity(currentVelocity);

            this._rotationRate = MovementComponent.lerp(this._rotationRate, direction.x, t * 10);

            const targetAngularVelocity = this._config.rotationSpeed * this._rotationRate * this._speedRate;
            const angularVelocity = this._physicsAggregate.body.getAngularVelocity();
            angularVelocity.y = targetAngularVelocity;
            angularVelocity.x = Math.sign(angularVelocity.x) * Math.min(Math.abs(angularVelocity.x), 2);
            angularVelocity.z = Math.sign(angularVelocity.z) * Math.min(Math.abs(angularVelocity.z), 2);
            this._physicsAggregate.body.setAngularVelocity(angularVelocity);
        }
    }

    public destroy(): void {
        this._physicsObject.dispose();
        super.destroy();
    }

    public resyncPhysics(teleportToGround = true): void {
        if (!this._physicsAggregate) {
            this._physicsAggregate = new PhysicsAggregate(this._physicsObject, PhysicsShapeType.BOX, { mass: 1, extents: new Vector3(this._config.collider.x, this._config.collider.y, this._config.collider.z), restitution: 0, friction: 0.05 });
        }
        this._physicsObject.position = this.parent.position.clone();
        this._physicsObject.rotationQuaternion = this.parent.rotation.toQuaternion();
        const physicsAggregate = this._physicsAggregate;
        physicsAggregate.body.disablePreStep = false;
        this._physicsAggregate = physicsAggregate;
        this._physicsAggregate.body.setLinearVelocity(Vector3.Zero());
        this._physicsAggregate.body.setAngularVelocity(Vector3.Zero());
        this._speedRate = 0;
        this._rotationRate = 0;

        if (teleportToGround) {
            const downRotation = Vector3.TransformNormal(Vector3.Down(), this._physicsObject.getWorldMatrix());
            const raycast = this.parent.level.scene.getPhysicsEngine().raycast(this.parent.position, this.parent.position.add(downRotation.scale(100)));
            if (raycast.hasHit) {
                this._physicsObject.position = raycast.hitPoint.add(downRotation.scale(-this._config.collider.y / 2));
                this.parent.position = this._physicsObject.position;
            }
        }
    }

    private static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
    private static getAngle180(angleRad: number): number {
        const angleDeg = angleRad * 180 / Math.PI;
        return (angleDeg + 180) % 360 - 180;
    }

    private static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }
}

class MovementInput {
    public axis: Vector2 = Vector2.Zero();
}

export default MovementComponent;
export { MovementInput };
import {Quaternion, Vector2} from "@babylonjs/core/Maths/math.vector";
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
    private _owned: boolean = true;
    private _enabled: boolean = true;
    private _driftDirection: number = 0;

    private _serverPosition: Vector3 = Vector3.Zero();
    private _serverRotation: Vector3 = Vector3.Zero();
    private _serverVelocity: Vector3 = Vector3.Zero();

    private _collisionImpulseTime: number = 0;

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
        if (!this._enabled) {
            return;
        }
        this._collisionImpulseTime -= t;
        if (!this._owned) {
            const distance = Vector3.Distance(this._physicsObject.position, this._serverPosition);
            if (distance < 2) {
                this._physicsObject.position = Vector3.Lerp(this._physicsObject.position, this._serverPosition, t * 5);
                this._physicsObject.rotationQuaternion = Quaternion.Slerp(this._physicsObject.rotationQuaternion, this._serverRotation.toQuaternion(), t * 5);
                this._physicsAggregate.body.setLinearVelocity(Vector3.Lerp(this._physicsAggregate.body.getLinearVelocity(), this._serverVelocity, t / 10));
                this._physicsAggregate.body.setAngularVelocity(Vector3.Zero());
                this._serverVelocity = Vector3.Lerp(this._serverVelocity, Vector3.Zero(), t);
            } else {
                this._physicsObject.position = this._serverPosition;
                this._physicsObject.rotationQuaternion = this._serverRotation.toQuaternion();
                this._physicsAggregate.body.setLinearVelocity(this._serverVelocity);
                this._physicsAggregate.body.setAngularVelocity(Vector3.Zero());
                this._serverVelocity = Vector3.Zero();
            }
        }
        this.parent.position = this._physicsObject.position;
        this.parent.rotation = this._physicsObject.rotationQuaternion.toEulerAngles();
        if (!this._owned) {
            return;
        }

        // raycast to check if grounded
        const downRotation = Vector3.TransformNormal(Vector3.Down(), this._physicsObject.getWorldMatrix());

        const raycast = this.parent.level.scene.getPhysicsEngine().raycast(this.parent.position, this.parent.position.add(downRotation.scale(this._config.collider.y + 0.1)));
        const isGrounded = raycast.hasHit;

        // console.log(isGrounded + ": " + this.parent.position + " " + this._config.collider.y + " " + downRotation);

        if (!isGrounded) {
            const velocity = this._physicsAggregate.body.getLinearVelocity();
            if (Math.abs(velocity.y) < 0.4) {
                // move down
                const angularVelocity = this._physicsAggregate.body.getAngularVelocity();
                const xDeg = this.parent.rotation.x * 180 / Math.PI;
                if (Math.abs(xDeg) > 60) {
                    angularVelocity.x = 3 * Math.sign(xDeg);
                }
                const zDeg = this.parent.rotation.z * 180 / Math.PI;
                if (Math.abs(zDeg) > 60) {
                    angularVelocity.z = 3 * Math.sign(zDeg);
                }
                this._physicsAggregate.body.setAngularVelocity(angularVelocity);
            } else {
                const angularVelocity = this._physicsAggregate.body.getAngularVelocity();
                angularVelocity.x = Math.sign(angularVelocity.x) * Math.min(Math.abs(angularVelocity.x), 2);
                angularVelocity.z = Math.sign(angularVelocity.z) * Math.min(Math.abs(angularVelocity.z), 2);
                this._physicsAggregate.body.setAngularVelocity(angularVelocity);
            }
        } else {
            const currentVelocity = this._physicsAggregate.body.getLinearVelocity();
            const direction = this.input.axis.clone();
            direction.x = MovementComponent.clamp(direction.x, -1, 1);
            direction.y = MovementComponent.clamp(direction.y, -1, 1);
            let targetSpeed = direction.y;

            let targetSpeedLerpCoefficient;
            if (Math.abs(targetSpeed) < 0.05) {
                targetSpeedLerpCoefficient = this._config.deceleration;
            } else if (Math.sign(targetSpeed) != Math.sign(currentVelocity.y)) {
                targetSpeedLerpCoefficient = this._config.brake;
            } else {
                targetSpeedLerpCoefficient = this._config.acceleration;
            }

            if (this.input.drift && Math.abs(direction.y) > 0.5) {
                if (this._driftDirection === 0) {
                    this._driftDirection = Math.sign(direction.x);
                    if (this._driftDirection === 0) {
                        this._driftDirection = Math.random() < 0.5 ? -1 : 1;
                    }
                }
                direction.x *= 0.75;
                direction.x += this._driftDirection * 0.9;
            } else {
                this._driftDirection = 0;
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
        if (this._physicsAggregate) {
            this._physicsAggregate.dispose();
        }
        if (this._physicsObject) {
            this._physicsObject.dispose();
        }
        super.destroy();
    }

    public resyncPhysics(teleportToGround = true): void {
        if (!this._physicsAggregate) {
            this._physicsAggregate = new PhysicsAggregate(this._physicsObject, PhysicsShapeType.BOX, { mass: 1, extents: new Vector3(this._config.collider.x, this._config.collider.y, this._config.collider.z), restitution: 0.5, friction: 0.05 });
            this._physicsAggregate.body.disablePreStep = false;

            /*const body = this._physicsAggregate.body;
            //@ts-ignore
            body.parent = this;
            body.setCollisionCallbackEnabled(true);
            body.getCollisionObservable().add((collider) => {
                const otherCollider = collider.collidedAgainst;
                //@ts-ignore
                if (!otherCollider.parent) {
                    return;
                }
                //@ts-ignore
                const otherMovementComponent = otherCollider.parent as MovementComponent;
                if (otherMovementComponent !== this) {
                    console.log("Collision with " + otherMovementComponent.parent.id);
                    const direction = this.parent.position.subtract(otherMovementComponent.parent.position).normalize();
                    const reflection = Vector3.Reflect(direction, collider.normal);
                    reflection.y = 0;
                    this._applyCollisionImpulse(reflection.scale(-5), collider.point);
                }
            });*/
        }
        this._physicsObject.position = this.parent.position.clone();
        this._physicsObject.rotationQuaternion = this.parent.rotation.toQuaternion();
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

    private static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    public onServerUpdate(position: Vector3, rotation: Vector3, velocity: Vector3) {
        this._serverPosition = position;
        this._serverRotation = rotation;
        this._serverVelocity = velocity;
        this._owned = false;
    }

    public get velocity(): Vector3 {
        if (this._physicsAggregate) {
            return this._physicsAggregate.body.getLinearVelocity();
        }
        return Vector3.Zero();
    }

    public get config(): MovementConfig {
        return this._config;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public get owned(): boolean {
        return this._owned;
    }

    public get driftDirection(): number {
        return this._driftDirection;
    }

    private _applyCollisionImpulse(force: Vector3, point: Vector3) {
        if (this._collisionImpulseTime > 0) {
            return;
        }
        this._physicsAggregate.body.applyImpulse(force, point);
        this._collisionImpulseTime = 0.5;
    }
}

class MovementInput {
    public axis: Vector2 = Vector2.Zero();
    public respawn: boolean = false;
    public drift: boolean = false;
}

export default MovementComponent;
export { MovementInput };
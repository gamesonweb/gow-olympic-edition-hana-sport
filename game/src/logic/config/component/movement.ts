export default interface MovementConfig {
    speed: number;
    acceleration: number;
    deceleration: number;
    brake: number;
    rotationSpeed: number;
    mass: number;
    collider: {
        x: number;
        y: number;
        z: number;
    }
}
import Character from "../../logic/gameobject/character";
import MovementComponent from "../../logic/gameobject/component/movement";
import InputManager from "../inputmanager";
import ISceneComponent from "./interface";
import CinematicComponent from "./cinematic";
import Scene from "../../scenes/scene";

export default class PlayerInput implements ISceneComponent {
    private static readonly KEY_FORWARD: string = "z";
    private static readonly KEY_BACKWARD: string = "s";
    private static readonly KEY_LEFT: string = "q";
    private static readonly KEY_RIGHT: string = "d";

    private _character: Character;
    private _cinematicComponent: CinematicComponent;

    constructor(scene: Scene) {
        this._cinematicComponent = scene.getComponent(CinematicComponent);
    }
    
    public destroy(): void {
        this._character = null;
    }

    public get character(): Character {
        return this._character;
    }

    public set character(character: Character) {
        this._character = character;
    }

    public update(): void {
        if (!this._character) {
            return;
        }

        const playingCinematic = this._cinematicComponent.playingCinematic;
        if (playingCinematic) {
            // set all inputs to 0
            InputManager.clear();
        }

        const movementComponent = this._character.findComponent(MovementComponent);
        if (movementComponent) {
            const axisX = this.getKeyAxis(PlayerInput.KEY_RIGHT) - this.getKeyAxis(PlayerInput.KEY_LEFT);
            const axisY = this.getKeyAxis(PlayerInput.KEY_FORWARD) - this.getKeyAxis(PlayerInput.KEY_BACKWARD);

            const input = movementComponent.input;
            input.axis.x = axisX;
            input.axis.y = axisY;
        }
    }

    private getKeyAxis(key: string): number {
        return InputManager.isKeyDown(key) ? 1 : 0;
    }
}
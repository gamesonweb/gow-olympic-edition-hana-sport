import Character from "../../logic/gameobject/character";
import MovementComponent from "../../logic/gameobject/component/movement";
import InputManager, {ControllerInput} from "../inputmanager";
import ISceneComponent from "./interface";
import CinematicComponent from "./cinematic";
import Scene from "../../scenes/scene";
import PlatformUtil from "../../logic/util/platformUtil";
import {VirtualJoystick} from "@babylonjs/core";
import {Vector2} from "@babylonjs/core/Maths/math.vector";

export default class PlayerInput implements ISceneComponent {
    public static KEY_FORWARD: string = "z";
    public static KEY_BACKWARD: string = "s";
    public static KEY_LEFT: string = "q";
    public static KEY_RIGHT: string = "d";
    public static KEY_RESPAWN: string = "m";
    public static KEY_DRIFT: string = "shift";

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
            const direction = this._readMoveVector();
            const drift = InputManager.isKeyDown(PlayerInput.KEY_DRIFT, false);
            const respawn = InputManager.isKeyDown(PlayerInput.KEY_RESPAWN, true);

            const input = movementComponent.input;
            input.axis.x = direction.x;
            input.axis.y = direction.y;
            input.respawn = respawn;
            input.drift = drift;
        }
    }

    private getKeyAxis(key: string): number {
        return InputManager.isKeyDown(key) ? 1 : 0;
    }

    private _readMoveVector(): Vector2 {
        const controllerInput = new Vector2(
            InputManager.getControllerInput(ControllerInput.R2) - InputManager.getControllerInput(ControllerInput.L2),
            InputManager.getControllerInput(ControllerInput.LEFT_STICK_Y)
        );
        if (controllerInput.length() > 0.01) {
            return controllerInput;
        }
        return new Vector2(
            this.getKeyAxis(PlayerInput.KEY_RIGHT) - this.getKeyAxis(PlayerInput.KEY_LEFT),
            this.getKeyAxis(PlayerInput.KEY_FORWARD) - this.getKeyAxis(PlayerInput.KEY_BACKWARD)
        );
    }
}

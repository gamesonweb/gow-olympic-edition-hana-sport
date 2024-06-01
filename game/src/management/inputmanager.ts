import { KeyboardEventTypes } from "@babylonjs/core";
import Scene from "../scenes/scene";
import {Vector2} from "@babylonjs/core/Maths/math.vector";

export default class InputManager {
    private static _keysDown: { [key: string]: boolean } = {};
    private static _controllerInput: { [key: number]: number } = {};

    public static init(scene : Scene) : void {
        scene.onKeyboardObservable.add((kbInfo) => {
            const key = kbInfo.event.key.toLowerCase();
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                InputManager._keysDown[key] = true;
            } else {
                InputManager._keysDown[key] = false;
            }
        });
    }

    public static isKeyDown(key: string, mask: boolean = false) : boolean {
        const result = InputManager._keysDown[key] || false;
        if (result && mask) {
            InputManager._keysDown[key] = false;
        }
        return result;
    }

    public static onKeyDown(key : string) : void {
        InputManager._keysDown[key] = true;
    }

    public static clear() : void {
        for (const key in InputManager._keysDown) {
            InputManager._keysDown[key] = false;
        }
    }

    public static setControllerInput(input : number, value : number) : void {
        InputManager._controllerInput[input] = value;
    }

    public static getControllerInput(input : number) : number {
        return InputManager._controllerInput[input] || 0;
    }

    public static clearControllerInput() : void {
        for (const key in InputManager._controllerInput) {
            InputManager._controllerInput[key] = 0;
        }
    }
}

export enum ControllerInput {
    LEFT_STICK_X = 0,
    LEFT_STICK_Y = 1,
    RIGHT_STICK_X = 2,
    RIGHT_STICK_Y = 3,

    A = 4, // X
    B = 5, // O
    C = 6, // Triangle
    D = 7, // Square

    L1 = 8,
    L2 = 9,
    R1 = 10,
    R2 = 11,
}
import MovementConfig from "../component/movement";
import RenderConfig from "../component/render";
import Config from "../config";

export default interface CharacterConfig extends Config {
    movement: MovementConfig;
    render: RenderConfig;
    audio: {
        path: string;
        volume: number;
        loop: boolean;
        pitch: number;
        pitchRange: number;
        randomPitch: number;
    }
}
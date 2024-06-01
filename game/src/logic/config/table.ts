import * as configsJson from '../../assets/configs.json';
import * as KartMap1  from "../../assets/levels/kart_map1.json"
import * as KartMap2  from "../../assets/levels/kart_map2.json"

import CharacterConfig from './gameobject/character';
import Globals from './globals';
import SceneConfig from './scene';
import AudioConfig from "./audio";

export default class ConfigTable {
    public static get characters(): CharacterConfig[] {
        return configsJson.characters;
    }
    public static get scenes(): SceneConfig[] {
        return [KartMap1 as SceneConfig, KartMap2 as SceneConfig];
    }
    public static get audios(): AudioConfig[] {
        return configsJson.audios;
    }

    public static get globals(): Globals {
        return configsJson.globals;
    }

    public static getCharacter(id: number): CharacterConfig {
        return configsJson.characters.find((character: CharacterConfig) => character.id === id);
    }

    public static getScene(id: number): SceneConfig {
        return ConfigTable.scenes.find((scene: SceneConfig) => scene.id === id);
    }
}
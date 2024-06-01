import ISceneComponent from "./interface";
import {Sound} from "@babylonjs/core";
import AudioConfig from "../../logic/config/audio";
import Level from "../../logic/level/level";
import ConfigTable from "../../logic/config/table";
import Scene from "../../scenes/scene";

export default class AudioComponent implements ISceneComponent {
    private readonly _level: Level;
    private readonly _audios: Map<AudioConfig, Sound> = new Map<AudioConfig, Sound>();

    private _currentAudioConfig: AudioConfig | null = null;
    private _currentAudio: Sound | null = null;

    constructor(scene: Scene, level: Level) {
        this._level = level;

        const audios = ConfigTable.audios;
        for (const audioConfig of audios) {
            const sound = new Sound(audioConfig.name, "assets/" + audioConfig.audio, scene, () => {
                this._audios.set(audioConfig, sound);
            }, {
                loop: false,
                autoplay: false,
            });
        }
    }

    update(): void {
        const audioConfig = this.pickAudio();
        if (!audioConfig) {
            return
        }

        if (this._currentAudioConfig === null || !this._currentAudio.isPlaying) {
            if (this._currentAudio) {
                // fade out then stop
                this._currentAudio.setVolume(0, 1);
                this._currentAudio.stop(1);
            }

            this._currentAudioConfig = null;
            this._currentAudio = null;

            if (audioConfig) {
                const audio = this._audios.get(audioConfig);
                if (audio) {
                    this._currentAudioConfig = audioConfig;
                    this._currentAudio = audio;
                    console.log("Playing audio: " + audioConfig.name);
                    audio.setVolume(audioConfig.volume, 1);
                    audio.play(0, 0);
                }
            }
        }
    }

    destroy(): void {
        for (const audio of this._audios.values()) {
            audio.dispose();
        }
    }

    pickAudio(): AudioConfig | null {
        if (ConfigTable.audios.length === 0) {
            return null;
        }
        return ConfigTable.audios[Math.floor(Math.random() * ConfigTable.audios.length)];
    }
}
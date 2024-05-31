import { AnimationGroup } from "@babylonjs/core";
import GameObject from "../gameObject";
import Component, { ComponentType } from "./component";
import AnimationConfig, { AnimationClipConfig } from "../../config/component/animation";

export default class AnimationComponent extends Component {
    private _groups: { [name: string]: AnimationGroup } = {};
    private _currentGroup: AnimationGroup;

    private _config: AnimationConfig;

    constructor(parent: GameObject, config: AnimationConfig = null) {
        super(parent);
        this._config = config;
    }

    private _loadAnimation(clip: AnimationClipConfig, speed: number = 1, stopCurrent: boolean = true, randomize = true): void {
        let clipName = clip.clip;
        if (clip.alt && clip.alt.length > 0 && randomize) {
            const rand = Math.random() * (clip.alt.length + 1);
            if (rand < clip.alt.length) {
                clipName = clip.alt[Math.floor(rand)];
            }
        }

        const group = this._groups[clipName];
        if (!group) {
          console.warn(`Animation group ${clipName} not found`);
          return null;
        }

        group.speedRatio = speed * clip.speed;

        if (group === this._currentGroup) {
            return;
        }

        group.play(clip.loop);
    
        if (stopCurrent) {
            if (this._currentGroup) {
                this._currentGroup.stop();
            }
        }

        this._currentGroup = group;
    }

    public play(name: string, speed = 1, stopCurrent: boolean = true, randomize = true): void {
        let clip: AnimationClipConfig;
        switch (name) {
            default:
                console.warn(`Unknown animation clip ${name}`);
                return;
        }

        this._loadAnimation(clip, speed, stopCurrent, randomize);
    }

    public get type(): ComponentType {
        return ComponentType.Animation;
    }
    
    public update(): void {
        
    }

    public setGroups(groups: AnimationGroup[]): void {
        groups.forEach((group) => {
            this._groups[group.name] = group;
        });
    }
}
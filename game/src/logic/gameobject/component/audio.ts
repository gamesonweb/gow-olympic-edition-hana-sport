import Component, {ComponentType} from "./component";
import {Sound} from "@babylonjs/core";
import GameObject from "../gameObject";
import MovementComponent from "./movement";

export default class AudioComponent extends Component {
    private audio: Sound;
    private loop: boolean;
    private volume: number;
    private pitch: number;
    private pitchRange: number;
    private randomPitch: number;

    constructor(parent: GameObject, config: { path: string, volume: number, loop: boolean, pitch: number, pitchRange: number, randomPitch: number }) {
        super(parent);
        this.audio = new Sound("audio", "assets/" + config.path, parent.level.scene, () => {
            this.play();
        }, {
            loop: config.loop,
            autoplay: false,
        });
        this.loop = config.loop;
        this.volume = config.volume;
        this.pitch = config.pitch;
        this.pitchRange = config.pitchRange;
        this.randomPitch = config.randomPitch;
    }

    destroy() {
        super.destroy();
        this.stop();
        this.audio.dispose();
    }

    public play(): void {
        this.audio.setVolume(this.volume);
        this.audio.loop = this.loop;
        this.audio.play();
    }

    public stop(): void {
        this.audio.pause();
    }

    update(t: number) {
        const movementComponent = this.parent.getComponent(MovementComponent);
        if (movementComponent) {
            const velocity = movementComponent.velocity.length() / movementComponent.config.speed;
            this.audio.setPlaybackRate(this.pitch + (velocity * this.pitchRange) + (Math.random() * this.randomPitch));
        } else {
            this.audio.setPlaybackRate(this.pitch);
        }
    }

    get type(): ComponentType {
        return ComponentType.Audio;
    }
}
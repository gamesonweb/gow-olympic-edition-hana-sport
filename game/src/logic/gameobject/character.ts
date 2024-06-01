import GameObject, {GameObjectType} from "./gameObject";
import BattlePlayer from "../battlePlayer";
import Level from "../level/level";
import Config from "../config/config";
import RenderComponent from "./component/render";
import CharacterConfig from "../config/gameobject/character";
import MovementComponent from "./component/movement";
import AudioComponent from "./component/audio";

export default class Character extends GameObject {
    private _ownerIndex: number;

    constructor(config: Config, level: Level, ownerIndex: number) {
        super(config, level);
        this._ownerIndex = ownerIndex;

        const characterConfig = config as CharacterConfig;
        this.addComponent(new RenderComponent(this, characterConfig.render));
        this.addComponent(new MovementComponent(this, characterConfig.movement));
        this.addComponent(new AudioComponent(this, characterConfig.audio));
    }

    public get type(): GameObjectType {
        return GameObjectType.Character;
    }

    public get player(): BattlePlayer {
        return this.level.battle.players[this._ownerIndex];
    }

    public get playerIndex(): number {
        return this._ownerIndex;
    }
}
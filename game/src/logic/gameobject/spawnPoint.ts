import GameObject, {GameObjectType} from "./gameObject";

export class SpawnPoint extends GameObject {
    private _order: number;

    public get type(): GameObjectType {
        return GameObjectType.SpawnPoint;
    }

    load(data: any) {
        super.load(data);
        this._order = data.order;
    }
}
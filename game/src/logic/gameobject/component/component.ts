import GameObject from "../gameObject";

abstract class Component {
    protected _parent: GameObject;

    constructor(parent: GameObject) {
        this._parent = parent;
    }

    public destroy(): void {
        this._parent = null;
    }

    public get parent(): GameObject {
        return this._parent;
    }

    public abstract get type(): ComponentType;
    public abstract update(t: number): void;
}

enum ComponentType {
    Movement = 0,
    Render = 1,
    Audio = 2,
}

export default Component;
export { ComponentType };
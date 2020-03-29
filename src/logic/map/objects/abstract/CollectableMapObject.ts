import MapObject from "./MapObject";
import { MapObjectTypeID } from "../../../../assets/MapObjectRsources";
import { Point } from "../../../../ts_library/space/SimpleShapes";

export default class CollectableMapObject extends MapObject {
    public readonly collectable: string | number;

    constructor(type: MapObjectTypeID, position: Point, collectable: string | number) {
        super(type, position);
        this.collectable = collectable;
    }

    public is_money(): boolean {
        return typeof (this.collectable) === 'number';
    }

    public touched_by(event: MapObject): this {
        this.destroy();
        return this;
    }
}
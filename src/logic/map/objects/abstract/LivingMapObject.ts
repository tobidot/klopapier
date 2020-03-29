import MapObject from "./MapObject";
import MovingMapObject from "./MovingMapObject";
import DamageDescription from "../../../fight/DamageDescription";
import { MapObjectTypeID } from "../../../../assets/MapObjectRsources";
import { Point } from "../../../../ts_library/space/SimpleShapes";

export default class LivingMapObject extends MovingMapObject {
    protected max_hitpoints: number;
    protected hitpoints: number;

    constructor(type: MapObjectTypeID, pos: Point, max_hitpoints: number) {
        super(type, pos);
        this.hitpoints = this.max_hitpoints = max_hitpoints;
    }

    public damage(damage: DamageDescription): this {
        this.hitpoints -= damage.amount;
        super.damage(damage);
        if (this.hitpoints < 0) this.destroy();
        return this;
    }
}
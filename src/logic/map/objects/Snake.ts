import StaticMapObject from "./abstract/StaticMapObject";
import { Point } from "../../../ts_library/space/SimpleShapes";
import { MapObjectTypeID } from "../../../assets/MapObjectRsources";
import LivingMapObject from "./abstract/LivingMapObject";

export default class Snake extends LivingMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.SNAKE, pos, 3);
    }

}
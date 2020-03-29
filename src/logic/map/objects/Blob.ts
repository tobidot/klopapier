import { Point } from "../../../ts_library/space/SimpleShapes";
import StaticMapObject from "./abstract/StaticMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectRsources";
import LivingMapObject from "./abstract/LivingMapObject";

export default class Blob extends LivingMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.BLOB, pos, 5);
    }

}
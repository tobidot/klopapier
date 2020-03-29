import LivingMapObject from "./abstract/LivingMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";

export default class Virus extends LivingMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.VIRUS, pos, 10);
    }
}
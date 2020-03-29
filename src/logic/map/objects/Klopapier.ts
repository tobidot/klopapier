import CollectableMapObject from "./abstract/CollectableMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";

export default class Klopapier extends CollectableMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.KLOPAPIER, pos, 'klopapier');
    }
}
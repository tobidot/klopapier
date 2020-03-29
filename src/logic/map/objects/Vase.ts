import CollectableMapObject from "./abstract/CollectableMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";

export default class Vase extends CollectableMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.VASE_WITH_SIGN, pos, 'Blue Stone');
    }
}
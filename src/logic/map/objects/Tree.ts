import StaticMapObject from "./abstract/StaticMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectRsources";
import { Point } from "../../../ts_library/space/SimpleShapes";

export default class Tree extends StaticMapObject {
    constructor(pos: Point) {
        super(MapObjectTypeID.TREE, pos);
    }

}
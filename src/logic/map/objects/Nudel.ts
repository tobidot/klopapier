import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import MapObject from "./abstract/MapObject";

export default class Nudel extends MapObject {
    constructor() {
        super(MapObjectTypeID.NUDEL);
    }
}
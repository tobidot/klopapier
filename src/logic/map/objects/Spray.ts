import CollectableMapObject from "./abstract/CollectableMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";

export default class Spray extends CollectableMapObject {
    constructor(map: WorldMap<TerrainTypeID>, pos: Point) {
        super(MapObjectTypeID.SPRAY, pos, 'spray');
    }
}
import CollectableMapObject from "./abstract/CollectableMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";

export default class Nudel extends CollectableMapObject {
    constructor(map: WorldMap<TerrainTypeID>, pos: Point) {
        super(MapObjectTypeID.NUDEL, pos, 'nudel');
    }
}
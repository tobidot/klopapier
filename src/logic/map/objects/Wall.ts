import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import MapObject from "./abstract/MapObject";
import { PositionComponent } from "./components/PositionComponent";

export default class Wall extends MapObject {
    constructor() {
        super(MapObjectTypeID.WALL);
        const position = new PositionComponent();
        this.add(position);
    }
}
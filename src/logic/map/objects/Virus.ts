import LivingMapObject from "./abstract/LivingMapObject";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WalkingComponent from "./components/WalkingComponent";
import MapObject from "./abstract/MapObject";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import InfectedWalkingComponent from "./components/InfectedWalkingComponent";
import DieOnSprayComponent from "./components/DieOnSprayComponent";
import InfectedSpreadComponent from "./components/InfectedSpreadComponent";

export default class Virus extends LivingMapObject {
    constructor(map: WorldMap<TerrainTypeID>, pos: Point) {
        super(MapObjectTypeID.VIRUS, pos, 10);
        let walking = new InfectedWalkingComponent(map, this);
        this.components.add(walking);
        walking.steps_interval_in_seconds = 0.25;
        let spread = new InfectedSpreadComponent(map, this);
        this.components.add(spread);
        let die_on_spray = new DieOnSprayComponent(this);
        this.components.add(die_on_spray);
    }
}
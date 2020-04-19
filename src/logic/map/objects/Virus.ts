import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { Point } from "../../../ts_library/space/SimpleShapes";
import WalkingComponent from "./components/WalkingComponent";
import MapObject from "./abstract/MapObject";
import WorldMap from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import InfectedWalkingComponent from "./components/InfectedWalkingComponent";
import DieOnSprayComponent from "./components/DieOnSprayComponent";
import InfectedSpreadComponent from "./components/InfectedSpreadComponent";

export default class Virus extends MapObject {
    constructor() {
        super(MapObjectTypeID.VIRUS);
        //         super(MapObjectTypeID.VIRUS, pos, 10);
        //         this.time_to_finish_movement = 0.1;
        //         let walking = new InfectedWalkingComponent(map, this);
        //         this.components.add(walking);
        //         walking.steps_interval_in_seconds = 0.125;
        //         walking.chance_to_move = 1;
        //         let spread = new InfectedSpreadComponent(map, this);
        //         this.components.add(spread);
        //         let die_on_spray = new DieOnSprayComponent(this);
        //         this.components.add(die_on_spray);
        //     }
    }
}
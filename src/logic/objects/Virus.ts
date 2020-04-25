import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import InfectedSpreadComponent from "../components/InfectedSpreadComponent";


export default class Virus extends MapObject {
    constructor() {
        super(MapObjectTypeID.VIRUS);
        let position = new PositionComponent();
        position.collision_group = CollisionGroups.MOVEABLE;
        position.collision_mask = CollisionGroups.MOVEABLE | CollisionGroups.INTERACTABLE;
        this.add(position);
        let spread = new InfectedSpreadComponent();
        this.add(spread);

        //         super(MapObjectTypeID.VIRUS, pos, 10);
        //         this.time_to_finish_movement = 0.1;
        //         let walking = new InfectedWalkingComponent(map, this);
        //         this.components.add(walking);
        //         walking.steps_interval_in_seconds = 0.125;
        //         walking.chance_to_move = 1;
        //         let die_on_spray = new DieOnSprayComponent(this);
        //         this.components.add(die_on_spray);
        //     }
    }
}
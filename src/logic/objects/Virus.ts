import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import InfectedSpreadComponent from "../components/InfectedSpreadComponent";
import { GameState } from "../../main/GameState";
import DieOnSprayComponent from "../components/DieOnSprayComponent";
import InfectedWalkingComponent from "../components/InfectedWalkingComponent";
import DamageOtherObjectsComponent from "../components/DamageOtherObjectsComponent";
import HitPointsComponent from "../components/HitPointsComponent";
import DamageHumansComponent from "../components/DamageHumansComponent";
import MovingComponent from "../components/MovingComponent";


export default class Virus extends MapObject {
    constructor(game_state?: GameState) {
        super(MapObjectTypeID.VIRUS);

        let position = new PositionComponent();
        position.collision_group = CollisionGroups.MOVEABLE;
        position.collision_mask = CollisionGroups.INTERACTABLE | CollisionGroups.MOVEABLE | CollisionGroups.PURIFIED;
        this.add(position);

        let moving = new MovingComponent();
        moving.time_needed_to_move = 0.125;
        this.add(moving);

        let spread = new InfectedSpreadComponent();
        this.add(spread);

        let die_on_spray = new DieOnSprayComponent();
        this.add(die_on_spray);

        let walking = new InfectedWalkingComponent();
        this.add(walking);
        walking.steps_interval_in_seconds = 0.125;
        walking.chance_to_move = 1;

        let hitpoints = new HitPointsComponent();
        hitpoints.current = hitpoints.max = 10;
        this.add(hitpoints);

        // let damage_other_objects = new DamageOtherObjectsComponent();
        // damage_other_objects.interval_in_seconds = 0.5;
        // this.add(damage_other_objects);

        let damage_humans = new DamageHumansComponent();
        this.add(damage_humans);

        if (game_state) {
            spread.last_day = game_state.day;
        }
    }
}
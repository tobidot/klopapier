import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import InfectedSpreadComponent from "../components/InfectedSpreadComponent";
import { GameState } from "../../main/GameState";
import DieOnSprayComponent from "../components/DieOnSprayComponent";
import InfectedWalkingComponent from "../components/InfectedWalkingComponent";
import DamageOtherObjectsComponent from "../components/DamageOtherObjectsComponent";
import HitPointsComponent from "../components/HitPointsComponent";


export default class Virus extends MapObject {
    constructor(game_state?: GameState) {
        super(MapObjectTypeID.VIRUS);

        let position = new PositionComponent();
        position.collision_group = CollisionGroups.MOVEABLE;
        position.collision_mask = CollisionGroups.INTERACTABLE | CollisionGroups.MOVEABLE;
        this.add(position);

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

        let damage_other_objects = new DamageOtherObjectsComponent();
        damage_other_objects.interval_in_seconds = 0.5;
        this.add(damage_other_objects);

        if (game_state) {
            spread.last_day = game_state.day;
        }
    }
}
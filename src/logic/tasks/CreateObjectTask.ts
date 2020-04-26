import { Task } from "./Task";
import MapObject from "../objects/MapObject";
import { Point } from "../../ts_library/space/SimpleShapes";
import { GameState } from "../../main/GameState";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import { MapFieldData } from "../../loading/MapData";
import MapObjectComponent from "../components/MapObjectComponent";

export default class CreateObjectTask extends Task {
    constructor(public readonly create_template: { (game_state: GameState): MapObject }, public readonly target: Point) {
        super();
    }

    public before_execute(game_state: GameState): boolean {
        const field = game_state.world_map.at(this.target);
        if (!field) return false;
        const is_walkable: boolean = field.objects.reduce((walkable: boolean, object: MapObject): boolean => {
            const position = object.get(PositionComponent);
            if (!position) return walkable;
            return walkable && !(position.collision_mask & CollisionGroups.MOVEABLE);
        }, true);
        if (!is_walkable) return false;
        return true;
    }

    public execute(game_state: GameState): GameState {
        const field = game_state.world_map.at(this.target);
        if (!field) return game_state;
        const object = this.create_template(game_state);
        const position = object.get(PositionComponent);
        if (position) {
            position.position = this.target.copy();
        }
        field.objects.push(object);
        return game_state;
    }
}
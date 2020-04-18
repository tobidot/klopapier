import { Task } from "../Task";
import MapObject from "../../map/objects/abstract/MapObject";
import Field from "../../map/Field";
import { Point } from "../../../ts_library/space/SimpleShapes";
import { GameState } from "../../../main/GameState";

export interface MoveObject extends Task {
    task: "move_object";
    source: Point;
    object: MapObject;
    target: Point;
}

export function move_object(game_state: GameState, task: MoveObject): GameState {
    const field = game_state.world_map.at(task.source);
    if (!field) return game_state;
    const index = field.objects.indexOf(task.object);
    if (index < 0) return game_state;
    const target_field = game_state.world_map.at(task.source);
    if (!target_field) return game_state;
    if (!is_valid_target(task.object, target_field)) return game_state;
    field.objects = field.objects.filter((object) => { task.object === object });
    return game_state;
}

function is_valid_target(object: MapObject, field: Field): boolean {
    return (field.objects.length === 0);
}
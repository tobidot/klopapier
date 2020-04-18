import MapObject, { ObjectID } from "../../map/objects/abstract/MapObject";
import { Task } from "../Task";
import { GameState } from "../../../main/GameState";
import Field from "../../map/Field";

export interface DamageObject extends Task {
    task: "damage_object";
    target_id: ObjectID;
    amount: number;
}

export function damage_object(game_state: GameState, task: DamageObject): GameState {
    // TODO damage object
    return game_state;
}

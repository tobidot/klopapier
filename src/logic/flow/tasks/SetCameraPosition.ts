import { Point } from "../../../ts_library/space/SimpleShapes";
import { Task } from "../Task";
import { GameState } from "../../../main/GameState";

export interface SetCameraPosition extends Task {
    task: "set_camera_position",
    new_position: Point,
}

export function set_camera_position(game_state: GameState, task: SetCameraPosition): GameState {
    game_state.camera_position = task.new_position;
    return game_state;
}
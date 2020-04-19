import { Point } from "../../../ts_library/space/SimpleShapes";
import { Task } from "../Task";
import { GameState } from "../../../main/GameState";
import Game from "../../../Game";

export class SetCameraPositionTask extends Task {
    public constructor(public new_position: Point) {
        super();
    }

    public execute(game_state: GameState): GameState {
        game_state.camera_position = this.new_position;
        return game_state;
    }
}
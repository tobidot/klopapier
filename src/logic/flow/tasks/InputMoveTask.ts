import { Task } from "../Task";
import { GameState } from "../../../main/GameState";
import { Direction } from "../../../ts_library/space/Direction";

export default class InputMoveTask extends Task {
    public controlled_callbacks: ((game_state: GameState) => GameState)[] = [];

    public constructor(public direction: Direction) {
        super();
    }

    public execute(game_state: GameState): GameState {
        let new_game_state = this.controlled_callbacks.reduce((game_state, callback) => {
            return callback(game_state);
        }, game_state);
        this.controlled_callbacks = [];
        return new_game_state;
    }
}
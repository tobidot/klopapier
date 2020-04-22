import { GameState } from "../../main/GameState";

export abstract class Task {
    public before_execute(game_state: GameState): boolean { return true; };
    public execute(game_state: GameState): GameState { return game_state; };
}
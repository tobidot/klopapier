import { GameState } from "../../main/GameState";

export abstract class Task {
    public abstract execute(game_state: GameState): GameState;
}
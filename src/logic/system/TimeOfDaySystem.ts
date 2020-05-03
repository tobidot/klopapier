import System from "./System";
import { GameState } from "../../main/GameState";
import { GameMode } from "../../main/GameMode";

export default class TimeOfDaySystem extends System {
    public update(delta_seconds: number, game_state: GameState): GameState {
        if (game_state.modus !== GameMode.PLAYING) return game_state;
        game_state.time_of_day += delta_seconds * 2;
        if (game_state.time_of_day > 24) {
            game_state.time_of_day -= 24;
            game_state.day++;
        }
        return game_state;
    }

}
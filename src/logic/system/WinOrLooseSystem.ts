import System from "./System";
import { GameState, PostGameStats, GameResult } from "../../main/GameState";
import { GameMode } from "../../main/GameMode";
import RestartLevelSystemEvent from "./events/RestartLevelSystemEvent";
import LoadNextLevelSystemEvent from "./events/LoadNextLevelSystemEvent";

export default class WinOrLooseSystem extends System {

    public update(delta_seconds: number, game_state: GameState): GameState {
        if (game_state.calculated.remaining_humans <= 0) {
            const post_game_state: PostGameStats = {
                won_or_lost: GameResult.LOST
            };
            System.events.trigger_event(new RestartLevelSystemEvent());
            return Object.assign(game_state, { modus: GameMode.INTERMISSION, post_game_state });
        }
        if (game_state.calculated.remaining_virusses <= 0) {
            const post_game_state: PostGameStats = {
                won_or_lost: GameResult.WON
            };
            System.events.trigger_event(new LoadNextLevelSystemEvent());
            return Object.assign(game_state, { modus: GameMode.INTERMISSION, post_game_state });
        }
        return game_state;
    }
}
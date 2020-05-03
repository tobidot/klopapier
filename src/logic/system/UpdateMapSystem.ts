import { GameState } from "../../main/GameState";
import { GameMode } from "../../main/GameMode";
import SystemEvent from "./events/SystemEvent";
import System from "./System";

export default class UpdateMapSystem extends System {

    public update(delta_seconds: number, game_state: GameState): GameState {
        if (game_state.modus !== GameMode.PLAYING) return game_state;
        game_state.tasks.push(...game_state.world_map.update(delta_seconds, game_state));
        return game_state;
    }

}

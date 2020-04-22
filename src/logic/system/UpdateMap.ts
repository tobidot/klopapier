import { GameState } from "../../main/GameState";

export default class UpdateMapSystem {

    public update(delta_seconds: number, game_state: GameState): GameState {
        game_state.tasks.push(...game_state.world_map.update(delta_seconds));
        return game_state;
    }
}

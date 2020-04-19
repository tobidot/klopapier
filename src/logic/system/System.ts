import { GameState } from "../../main/GameState";

export default abstract class System {

    public constructor() {

    }

    public abstract update(delta_seconds: number, game_state: GameState): GameState;
}
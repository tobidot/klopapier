import { GameState } from "../../main/GameState";
import SystemEvent from "./events/SystemEvent";
import { ListenerSocket } from "../../ts_library/ui/Listener";

export default abstract class System {

    public static readonly events: ListenerSocket<SystemEvent> = new ListenerSocket<SystemEvent>();

    public constructor() {

    }

    public abstract update(delta_seconds: number, game_state: GameState): GameState;
    public handle(event: SystemEvent): void { };
}
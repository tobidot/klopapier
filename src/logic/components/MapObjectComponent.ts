import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task"; import { GameState } from "../../main/GameState";

export default class MapObjectComponent {
    public constructor() { }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] { return []; }
    public handle(game_state: GameState, task: Task, self: MapObject): GameState { return game_state; };
}

import { MapEvent } from "../../events/MapEvent";
import { Task } from "../../../flow/Task";
import MapObject from "../abstract/MapObject";
import { GameState } from "../../../../main/GameState";

export default class MapObjectComponent {
    constructor(public name: string) { }

    public update(delta_seconds: number, self: MapObject): Task[] { return []; }
    public handle(game_state: GameState, task: Task, self: MapObject): GameState { return game_state; };
}
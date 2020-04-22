import MapObjectComponent from "./MapObjectComponent";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import { GameState } from "../../../../main/GameState";
import { Task } from "../../../flow/Task";
import MapObject from "../abstract/MapObject";
import { MoveObjectTask } from "../../../flow/tasks/MoveObjectTask";

export class PositionComponent extends MapObjectComponent {
    public static NAME = "position";
    public position: Point = new Point(0, 0);

    constructor() {
        super(PositionComponent.NAME);
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof MoveObjectTask) {
            this.position = task.target;
        }
        return game_state;
    };
}
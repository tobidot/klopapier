import MapObjectComponent from "./MapObjectComponent";
import { Direction } from "../../ts_library/space/Direction";
import { Point } from "../../ts_library/space/SimpleShapes";
import MapObject from "../objects/MapObject";
import { PositionComponent } from "./PositionComponent";
import { Task } from "../tasks/Task";
import { MoveObjectTask } from "../tasks/MoveObjectTask";
import { GameState } from "../../main/GameState";

export default class MovingComponent extends MapObjectComponent {
    public position_buffer: Point | null = null;
    public previous_position: Point = new Point(0, 0);
    public look_direction: Direction = Direction.DOWN;
    public time_needed_to_move: number = 1;
    public progress: number | false = false;

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        if (this.progress !== false) {
            this.progress = Math.min(1, this.progress + delta_seconds / this.time_needed_to_move);
            if (this.progress >= 1) {
                this.progress = false;
            }
        }
        return [];
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (!(task instanceof MoveObjectTask)) return game_state;
        if (task.object_id !== self.instance_ID) return game_state;
        this.previous_position = task.source;
        this.progress = 0;
        return game_state;
    }
}
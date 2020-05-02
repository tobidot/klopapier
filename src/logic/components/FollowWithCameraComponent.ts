import MapObjectComponent from "./MapObjectComponent"; import { Point } from "../../ts_library/space/SimpleShapes"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task"; import { PositionComponent } from "./PositionComponent"; import { SetCameraPositionTask } from "../tasks/SetCameraPositionTask"; import { GameState } from "../../main/GameState"; import { MoveObjectTask } from "../tasks/MoveObjectTask";
import MovingComponent from "./MovingComponent";


export default class FollowWithCameraComponent extends MapObjectComponent {
    private p: Point = new Point(0, 0);

    public constructor() {
        super();
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        const moving = self.get(MovingComponent);
        if (!position) return [];
        if (moving && moving.progress !== false) {
            const diff = position.position.sub(moving.previous_position);
            const point = moving.previous_position.add(diff.mul(moving.progress));
            if (position.position.equals(point)) return [];
            return [new SetCameraPositionTask(this.p = point)];
        } else {
            if (position.position.equals(this.p)) return [];
            return [new SetCameraPositionTask(this.p = position.position)];
        }
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof MoveObjectTask && self.instance_ID === task.object_id) {
            const position = self.get(PositionComponent);
            const moving = self.get(MovingComponent);
            if (position) {
                if (moving && moving.progress !== false) {
                    const diff = position.position.sub(moving.previous_position);
                    const point = moving.previous_position.add(diff.mul(moving.progress));
                    this.p = game_state.camera_position = point;
                } else {
                    this.p = game_state.camera_position = task.target;
                }
            }
        }
        return game_state;
    }
} 
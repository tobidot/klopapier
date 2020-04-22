import MapObject, { ObjectID } from "../abstract/MapObject";
import MapObjectComponent from "./MapObjectComponent";
import { Task } from "../../../flow/Task";
import { PositionComponent } from "./PositionComponent";
import { SetCameraPositionTask } from "../../../flow/tasks/SetCameraPositionTask";
import Game from "../../../../Game";
import { GameState } from "../../../../main/GameState";
import { MoveObjectTask } from "../../../flow/tasks/MoveObjectTask";
import { Point } from "../../../../ts_library/space/SimpleShapes";

export default class FollowWithCameraComponent extends MapObjectComponent {
    public static NAME = "follow_with_camera";
    private p: Point = new Point(0, 0);

    public constructor() {
        super(FollowWithCameraComponent.NAME);
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        if (position.position.equals(this.p)) return [];
        return [new SetCameraPositionTask(this.p = position.position)];
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof MoveObjectTask) {
            const position = self.get(PositionComponent);
            if (position) {
                game_state.camera_position = task.target;
            }
        }
        return game_state;
    }
} 
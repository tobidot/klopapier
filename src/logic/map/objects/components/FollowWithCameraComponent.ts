import MapObject, { ObjectID } from "../abstract/MapObject";
import MapObjectComponent from "./MapObjectComponent";
import { Task } from "../../../flow/Task";
import { PositionComponent } from "./PositionComponent";
import { SetCameraPositionTask } from "../../../flow/tasks/SetCameraPositionTask";
import Game from "../../../../Game";
import { GameState } from "../../../../main/GameState";
import { MoveObjectTask } from "../../../flow/tasks/MoveObjectTask";

export default class FollowWithCameraComponent extends MapObjectComponent {
    public static NAME = "follow_with_camera";

    public constructor() {
        super(FollowWithCameraComponent.NAME);
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        return [new SetCameraPositionTask(position.position)];
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof MoveObjectTask) {
            const position = self.get(PositionComponent);
            if (position) {
                game_state.camera_position = position.position;
            }
        }
        return game_state;
    }
} 
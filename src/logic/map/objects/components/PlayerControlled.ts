import MapObjectComponent from "./MapObjectComponent";
import { GameState } from "../../../../main/GameState";
import MapObject from "../abstract/MapObject";
import { Task } from "../../../flow/Task";
import { create_timed_array_elements } from "../../../../ts_library/utility/Timed";
import { PositionComponent } from "./PositionComponent";
import { MoveObjectTask } from "../../../flow/tasks/MoveObjectTask";
import InputMoveTask from "../../../flow/tasks/InputMoveTask";
import { point_to_direction } from "../../../../ts_library/conversion/fromPoint";
import { direction_invert } from "../../../../ts_library/space/Direction";
import { direction_to_point } from "../../../../ts_library/conversion/fromDirection";

export default class PlayerControlledComponent extends MapObjectComponent {
    public static NAME = "player_controlled";
    private every_second = create_timed_array_elements(1);

    constructor() {
        super(PlayerControlledComponent.NAME);
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        let tasks: Task[] = [];
        return tasks;
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof InputMoveTask) {
            const position = self.get(PositionComponent);
            if (!position) return game_state;
            const source = position.position;
            const target = position.position.add(direction_to_point(task.direction, 1));
            task.controlled_callbacks.push((game_state: GameState) => {
                const move_object_task = new MoveObjectTask(source, target, self.instance_ID);
                const is_allowed = move_object_task.before_execute(game_state);
                if (!is_allowed) return game_state;
                const new_game_state = self.handle(game_state, move_object_task);
                return move_object_task.execute(new_game_state);
            });
            return game_state;
        }
        return game_state;
    }
}
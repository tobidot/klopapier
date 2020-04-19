import System from "./System";
import { GameState } from "../../main/GameState";
import Game from "../../Game";
import { Task } from "../flow/Task";
import { set_camera_position, SetCameraPosition } from "../flow/tasks/SetCameraPosition";
import { do_task_move_object, MoveObjectTask } from "../flow/tasks/MoveObject";

export default class TaskHandleSystem extends System {


    public update(delta_seconds: number, game_state: GameState): GameState {
        game_state = game_state.tasks.reduce((game_state, task) => {
            return this.handle(task, game_state);
        }, game_state);
        game_state.tasks = [];
        return game_state;
    }

    private handle(task: Task, game_state: GameState): GameState {
        switch (task.task) {
            case "move_object":
                return do_task_move_object(game_state, task as MoveObjectTask);
                break;
            case "set_camera_position":
                return set_camera_position(game_state, task as SetCameraPosition);
            default:
                console.log('unhandled task');
                break;
        }
        return game_state;
    }
}
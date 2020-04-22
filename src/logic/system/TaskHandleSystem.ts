import System from "./System"; import { GameState } from "../../main/GameState"; import { Task } from "../tasks/Task";

export default class TaskHandleSystem extends System {


    public update(delta_seconds: number, game_state: GameState): GameState {
        game_state = game_state.tasks.reduce((game_state, task) => {
            return this.handle(task, game_state);
        }, game_state);
        game_state.tasks = [];
        return game_state;
    }

    private handle(task: Task, game_state: GameState): GameState {
        const is_allowed = task.before_execute(game_state);
        if (!is_allowed) return game_state;
        game_state = game_state.world_map.get_fields_in_rect(game_state.world_map.get_map_boundries()).reduce((game_state, field) => {
            return field.objects.reduce((game_state, object) => {
                return object.handle(game_state, task);
            }, game_state);
        }, game_state);
        game_state = task.execute(game_state);
        return game_state;
    }
}
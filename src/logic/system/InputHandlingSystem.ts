import System from "./System"; import { Task } from "../tasks/Task"; import { InputDelegator } from "../user_input/Input"; import InputMoveTask from "../tasks/InputMoveTask"; import { GameState } from "../../main/GameState";
import { Direction } from "../../ts_library/space/Direction";
import InputUseSprayTask from "../tasks/InputUseSprayTask";
import InputEatTask from "../tasks/InputEatTask copy";


export default class InputHandlingSystem extends System {
    private tasks: Array<Task>;

    constructor(input: InputDelegator) {
        super();
        this.tasks = [];
        input.on_direction_input = (direction: Direction): boolean => {
            this.tasks.push(new InputMoveTask(direction));
            return true;
        };
        input.on_use_spray = (): boolean => {
            this.tasks.push(new InputUseSprayTask());
            return true;
        }
        input.on_use_paper = (): boolean => {
            this.tasks.push(new InputUseSprayTask());
            return true;
        }
        input.on_eat = (): boolean => {
            this.tasks.push(new InputEatTask());
            return true;
        }

        input.on_request_menu = () => {
            //if (this.has_won || this.has_lost) this.game_state.current_level++;
            //this.reset_level();
        }
        input.on_pause = () => {
            // if (this.current_intersect !== null) this.current_intersect = null;
            // if (this.has_won || this.has_lost) this.reset_level();
        }
    }

    public update(delta_seconds: number, game_state: GameState): GameState {
        const next_task = this.get_tasks().shift();
        if (next_task) game_state.tasks.push(next_task);
        return game_state;
    }

    public get_tasks(): Task[] {
        const buffer = this.tasks;
        this.tasks = [];
        return buffer;
    }

}
import System from "./System"; import { Task } from "../tasks/Task"; import { InputDelegator } from "../user_input/Input"; import InputMoveTask from "../tasks/InputMoveTask"; import { GameState } from "../../main/GameState";
import { Direction } from "../../ts_library/space/Direction";
import InputUseSprayTask from "../tasks/InputUseSprayTask";
import InputEatTask from "../tasks/InputEatTask copy";
import { GameMode } from "../../main/GameMode";
import InputOpenMenuTask from "../tasks/InputOpenMenutask";
import InputTogglePauseTask from "../tasks/InputTogglePauseTask";
import Game from "../../Game";
import RestartLevelSystemEvent from "./events/RestartLevelSystemEvent";


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
            this.tasks.push(new InputOpenMenuTask());
            return true;
        }
        input.on_pause = () => {
            this.tasks.push(new InputTogglePauseTask());
            return true;
        }
    }

    public update(delta_seconds: number, game_state: GameState): GameState {
        const next_task = this.get_tasks().shift();
        if (next_task) this.handle_task(delta_seconds, game_state, next_task);
        return game_state;
    }

    public get_tasks(): Task[] {
        const buffer = this.tasks;
        this.tasks = [];
        return buffer;
    }

    private handle_task(delta_seconds: number, game_state: GameState, task: Task) {
        if (task instanceof InputTogglePauseTask) {
            switch (game_state.modus) {
                case GameMode.PLAYING:
                    game_state.modus = GameMode.PAUSE;
                    break;
                case GameMode.PAUSE:
                    game_state.modus = GameMode.PLAYING;
                    break;
                case GameMode.INTERMISSION:
                    game_state.modus = GameMode.PLAYING;
                    break;
            }
            game_state.tasks.push(task);
            return;
        }
        if (game_state.modus === GameMode.PLAYING) game_state.tasks.push(task);
    }
}
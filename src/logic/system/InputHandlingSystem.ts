import System from "./System"; import { Task } from "../tasks/Task"; import { InputDelegator } from "../user_input/Input"; import InputMoveTask from "../tasks/InputMoveTask"; import { GameState } from "../../main/GameState";
import { Direction } from "../../ts_library/space/Direction";


export default class InputHandlingSystem extends System {
    private tasks: Array<Task>;

    constructor(input: InputDelegator) {
        super();
        this.tasks = [];
        input.on_attack_input = this.on_attack;
        input.on_direction_input = (direction: Direction): boolean => {
            this.tasks.push(new InputMoveTask(direction));
            return true;
        };

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

    private on_attack = () => {
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar || inventar.has('spray') === false) return;

        // let direction = this.object.look_direction;
        // let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        // let target_field = this.world_map.at(target_pos);
        // if (target_field) {
        //     this.object.attack(target_field, DamageType.SPRAY);
        // }
        // if (target_field && target_field.objects) {
        //     target_field.objects.forEach((object) => object.damage({
        //         type: DamageType.SPRAY,
        //         source: this.object,
        //         amount: 1,
        //     }));
        // }
    }

    on_input_direction = (direction: Direction): boolean => {
        // let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        // let target_field = this.world_map.at(target_pos);
        // if (target_field) {
        //     if (this.object.moving_progress !== false) return false;
        //     this.object.move_to(this.world_map, target_pos);
        //     this.camera_position = this.object.get_position();
        // }
        return true;
    }

    on_input_use_paper = () => {
        // const field_pos = this.object.get_position();
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar) return;
        // const has = inventar.has('paperroll') || inventar.has('paperroll_half') || inventar.has('paperroll_last');
        // if (!has) return;
        // const old_field = this.world_map.at(field_pos);
        // if (old_field && (old_field.terrain.variation_key === 'default') &&
        //     (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
        //     if (inventar.has('paperroll_last')) {
        //         inventar.remove('paperroll_last');
        //     } else if (inventar.has('paperroll_half')) {
        //         inventar.remove('paperroll_half');
        //         inventar.items.push('paperroll_last')
        //     } else if (inventar.has('paperroll')) {
        //         inventar.remove('paperroll');
        //         inventar.items.push('paperroll_half')
        //     }
        //     this.world_map.update_field_at_point(field_pos, {
        //         terrain: {
        //             type: old_field.terrain.type,
        //             variation_key: 'with_paper',
        //         }
        //     });
        // }
    }

    on_input_use_spray = () => {
        // const field_pos = this.object.get_position();
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar || inventar.has('spray') === false) return;

        // const old_field = this.world_map.at(field_pos);
        // if (inventar.items.length > 0 && old_field && (old_field.terrain.variation_key === 'default' || old_field.terrain.variation_key === 'with_paper') &&
        //     (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
        //     inventar.remove('spray');
        //     this.world_map.update_field_at_point(field_pos, {
        //         terrain: {
        //             type: old_field.terrain.type,
        //             variation_key: 'with_spray',
        //         }
        //     });
        // }
    }

    on_input_eat = () => {
        // const inventar = this.object.components.get(InventarComponent);
        // const hunger = this.object.components.get(HungerComponent);
        // if (!inventar || inventar.has('nudel') === false) return;
        // inventar.remove('nudel');
        // if (!hunger) return;
        // hunger.urge_to_eat = Math.max(0, hunger.urge_to_eat - 40);

    }
}
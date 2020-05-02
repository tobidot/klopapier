import MapObjectComponent from "./MapObjectComponent"; import { create_timed_array_elements } from "../../ts_library/utility/Timed"; import MapObject from "../objects/MapObject"; import { Task } from "../tasks/Task"; import { PositionComponent, CollisionGroups } from "./PositionComponent"; import { GameState } from "../../main/GameState"; import InputMoveTask from "../tasks/InputMoveTask"; import { direction_to_point } from "../../ts_library/conversion/fromDirection"; import { MoveObjectTask } from "../tasks/MoveObjectTask";
import { ListenerSocket } from "../../ts_library/ui/Listener";
import { Direction } from "../../ts_library/space/Direction";
import InventarComponent from "./InventarComponent";
import DesinfectantChargesComponent from "./DesinfectantChargesComponent";
import CreateObjectTask from "../tasks/CreateObjectTask";
import Spray from "../objects/Spray";
import DesinfectionBlob from "../objects/DesinfectionBlob";
import InputUseSprayTask from "../tasks/InputUseSprayTask";
import InputUsePaperTask from "../tasks/InputUsePaperTask";
import InputEatTask from "../tasks/InputEatTask copy";
import IsEdibleComponent from "./IsEdibleComponent";
import HungerComponent from "./HungerComponent";
import PaperChargesComponent from "./ChargesComponent";
import PaperBlob from "../objects/PaperBlob";
import ChargesComponent from "./ChargesComponent";
import IsPaperComponent from "./IsPaperComponent";
import IsSprayComponent from "./IsSprayComponent";
import { MapObjectTypeID } from "../../assets/MapObjectResources";


export default class PlayerControlledComponent extends MapObjectComponent {
    public tasks: Array<Task> = [];
    // public move_input: ListenerSocket<Direction> = new ListenerSocket<Direction>();

    public update(delta_seconds: number, self: MapObject): Task[] {
        const buffer = this.tasks;
        this.tasks = [];
        return buffer;
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof InputMoveTask) return this.handle_input_move(game_state, task, self);
        if (task instanceof InputUseSprayTask) return this.handle_input_use_spray(game_state, task, self);
        if (task instanceof InputUsePaperTask) return this.handle_input_use_spray(game_state, task, self);
        if (task instanceof InputEatTask) return this.handle_input_eat(game_state, task, self);
        return game_state;
    }

    public handle_input_move(game_state: GameState, task: InputMoveTask, self: MapObject): GameState {
        const position = self.get(PositionComponent);
        if (!position) return game_state;
        const source = position.position;
        const target = position.position.add(direction_to_point(task.direction, 1));
        this.tasks.push(new MoveObjectTask(source, target, self.instance_ID));
        return game_state;
    }

    public handle_input_use_spray(game_state: GameState, task: InputUseSprayTask, self: MapObject): GameState {
        // Check if field target is valid
        const position = self.get(PositionComponent);
        if (!position) return game_state;
        const field = game_state.world_map.at(position.position);
        if (!field) return game_state;
        const is_occupied = field.objects.reduce((sum, object) => {
            if (object.instance_ID !== self.instance_ID) return sum;
            return sum + 1;
        }, 0) > 0;
        // Check if i have spray charges left
        const charges_available = this.use_charge_if_available(self, 1, (object) => object.type === MapObjectTypeID.SPRAY);
        if (!charges_available) return game_state;
        // Do ACTION
        // Create desinfected blob
        this.tasks.push(new CreateObjectTask(game_state => new DesinfectionBlob(), position.position, CollisionGroups.GHOST));

        return game_state;
    }

    public handle_input_use_paper(game_state: GameState, task: InputUseSprayTask, self: MapObject): GameState {
        // Check if field target is valid
        const position = self.get(PositionComponent);
        if (!position) return game_state;
        const field = game_state.world_map.at(position.position);
        if (!field) return game_state;
        const is_occupied = field.objects.reduce((sum, object) => {
            if (object.instance_ID !== self.instance_ID) return sum;
            return sum + 1;
        }, 0) > 0;
        // Check if i have spray charges left
        const charges_available = this.use_charge_if_available(self, 1, (object) => object.type === MapObjectTypeID.PAPER_ROLL);
        if (!charges_available) return game_state;
        // Do ACTION
        // Create paper blob
        this.tasks.push(new CreateObjectTask(game_state => new PaperBlob(), position.position));

        return game_state;
    }

    public handle_input_eat(game_state: GameState, task: InputUseSprayTask, self: MapObject): GameState {
        const hunger = self.get(HungerComponent);
        if (!hunger) return game_state;
        const charges_available = this.use_charge_if_available(self, 1, (object) => object.has(IsEdibleComponent));
        if (!charges_available) return game_state;
        // reduce hunger
        hunger.urge_to_eat = Math.max(0, hunger.urge_to_eat - 50);
        return game_state;
    }

    public use_charge_if_available(self: MapObject, requested_charges: number, item_condition: (object: MapObject) => boolean): boolean {
        // Check if i have noodles charges left
        const inventar = self.get(InventarComponent);
        if (!inventar) return false;
        const charge_object_ids = inventar.items.filter((object_id) => {
            const object = MapObject.get(object_id);
            if (!object) return false;
            if (!object.has(ChargesComponent)) return false;
            if (!item_condition(object)) return false;
            return true;
        }, []);
        const available_charge = charge_object_ids.reduce((sum, object_id) => {
            const object = MapObject.get(object_id) as MapObject;
            const charge = object.get(ChargesComponent) as ChargesComponent;
            return sum + charge.charges_left;
        }, 0);
        if (available_charge < requested_charges) return false;
        charge_object_ids.reduce((remaining_request, object_id) => {
            if (remaining_request <= 0) return 0;
            const object = MapObject.get(object_id) as MapObject;
            const charge = object.get(ChargesComponent) as ChargesComponent;
            const lost_charges = Math.min(charge.charges_left, remaining_request);
            charge.charges_left -= lost_charges;
            return remaining_request - lost_charges;
        }, requested_charges);
        return true;
    }
}
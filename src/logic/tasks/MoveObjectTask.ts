import { Task } from "./Task"; import { Point } from "../../ts_library/space/SimpleShapes"; import MapObject, { ObjectID } from "../objects/MapObject"; import { GameState } from "../../main/GameState"; import Field from "../map/Field";
import { PositionComponent } from "../components/PositionComponent";


export class MoveObjectTask extends Task {
    public constructor(public source: Point, public target: Point, public object_id: ObjectID) {
        super();
    }

    public before_execute(game_state: GameState): boolean {
        const task = this;
        const field = game_state.world_map.at(task.source);
        if (!field) return false;

        const object_index = field.objects.findIndex(object => object.instance_ID === task.object_id);
        if (object_index < 0) return false;
        const object = field.objects[object_index];
        const target_field = game_state.world_map.at(task.target);
        if (!target_field) return false;
        if (!this.is_valid_target(object, target_field)) return false;
        return true;
    }

    public execute(game_state: GameState): GameState {
        const task = this;
        const field = game_state.world_map.at(task.source);
        if (!field) return game_state;
        const target_field = game_state.world_map.at(task.target);
        if (!target_field) return game_state;
        const object = field.objects.find(object => object.instance_ID === task.object_id);
        if (!object) return game_state;
        field.objects = field.objects.filter((object) => task.object_id !== object.instance_ID);
        target_field.objects.push(object);
        return game_state;
    }

    private is_valid_target(object: MapObject, field: Field): boolean {
        const position = object.get(PositionComponent);
        if (!position) return (field.objects.length === 0);
        return field.objects.reduce<boolean>((result: boolean, field_object: MapObject) => {
            if (!result) return false;
            const field_object_position = field_object.get(PositionComponent);
            if (!field_object_position) return false;
            return !(position.collision_mask & field_object_position.collision_group);
        }, true);
    }
}
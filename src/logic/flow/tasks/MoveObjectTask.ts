import { Task } from "../Task";
import MapObject, { ObjectID } from "../../map/objects/abstract/MapObject";
import Field from "../../map/Field";
import { Point } from "../../../ts_library/space/SimpleShapes";
import { GameState } from "../../../main/GameState";
import { PositionComponent } from "../../map/objects/components/PositionComponent";

export class MoveObjectTask extends Task {
    public constructor(public source: Point, public target: Point, public object_id: ObjectID) {
        super();
    }

    public execute(game_state: GameState): GameState {
        const task = this;
        const field = game_state.world_map.at(task.source);
        if (!field) return game_state;

        const object_index = field.objects.findIndex(object => object.instance_ID === task.object_id);
        if (object_index < 0) return game_state;
        const object = field.objects[object_index];
        const target_field = game_state.world_map.at(task.target);
        if (!target_field) return game_state;
        if (!this.is_valid_target(object, target_field)) return game_state;
        field.objects = field.objects.filter((object) => { task.object_id === object.instance_ID });
        target_field.objects.push(object);
        const position = object.get(PositionComponent);
        if (position) position.position = task.target;
        return game_state;
    }
    private is_valid_target(object: MapObject, field: Field): boolean {
        return (field.objects.length === 0);
    }
}
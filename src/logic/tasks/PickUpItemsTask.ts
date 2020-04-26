import { Task } from "./Task";
import { GameState } from "../../main/GameState";
import MapObject, { ObjectID } from "../objects/MapObject";
import { Point } from "../../ts_library/space/SimpleShapes";
import IsCollectableComponent from "../components/IsCollectableComponent";
import InventarComponent from "../components/InventarComponent";
import { PositionComponent } from "../components/PositionComponent";

export default class PickUpItemsTask extends Task {
    public constructor(public readonly picker_id: ObjectID, public readonly target: Point) {
        super();
    }

    public execute(game_state: GameState): GameState {
        const picker = MapObject.get(this.picker_id);
        if (!picker) return game_state;
        const field = game_state.world_map.at(this.target);
        if (!field) return game_state;
        const inventar = picker.get(InventarComponent);
        if (!inventar) return game_state;
        field.objects = field.objects.filter((object) => {
            if (inventar.items.length >= inventar.size) return true;
            const is_collectable = object.get(IsCollectableComponent);
            if (is_collectable) {
                object.remove(PositionComponent);
                inventar.items.push(object.instance_ID);
                return false;
            } else {
                return true;
            }
        });
        return game_state;
    }
}
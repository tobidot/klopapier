import MapObjectComponent from "./MapObjectComponent";
import { Task } from "../tasks/Task";
import MapObject from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import { PositionComponent } from "./PositionComponent";
import DamageObjectTask from "../tasks/DamageObjectTask";

export default class DamageOtherObjectsComponent extends MapObjectComponent {
    public amount: number = 1;
    public interval_in_seconds: number = 1;
    public seconds_to_next_tick: number = 1;

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        // Check if tick is due
        this.seconds_to_next_tick -= delta_seconds;
        if (this.seconds_to_next_tick > 0) return [];
        this.seconds_to_next_tick += this.interval_in_seconds;
        // Get data
        const position = self.get(PositionComponent);
        if (!position) return [];
        const field = game_state.world_map.at(position.position);
        if (!field) return [];
        // Return Tasks
        return field.objects.filter((object) => object.instance_ID !== self.instance_ID).map((object) => {
            return new DamageObjectTask(object.instance_ID, this.amount);
        });
    }
}
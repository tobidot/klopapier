import MapObjectComponent from "./MapObjectComponent";
import { Task } from "../tasks/Task";
import MapObject from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import { PositionComponent } from "./PositionComponent";
import IsHumanComponent from "./IsHumanComponent";
import DamageObjectTask from "../tasks/DamageObjectTask";
import { Rect } from "../../ts_library/space/SimpleShapes";

export default class DamageHumansComponent extends MapObjectComponent {
    public interval_in_seconds: number = 1;
    public damage_per_tick: number = 1;
    public timer: number = 0;

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        // Do not work on daytime
        if (game_state.time_of_day > 6 && game_state.time_of_day < 18) return [];
        this.timer -= delta_seconds;
        if (this.timer > 0) return [];


        this.timer += this.interval_in_seconds;
        const position = self.get(PositionComponent);
        if (!position) return [];
        const fields = game_state.world_map.get_fields_in_rect(Rect.from_point_with_size(position.position, 2, 2));
        if (!fields) return [];
        return fields.flatMap(field => field.objects.filter(object => object.has(IsHumanComponent)).map((object): Task => {
            return new DamageObjectTask(object.instance_ID, this.damage_per_tick);
        }));
    }
}
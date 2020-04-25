import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import { Task } from "../tasks/Task";
import { PositionComponent } from "./PositionComponent";
import IsSprayComponent from "./IsSprayComponent";
import DestroyObjectTask from "../tasks/DestroyObjectTask";

export default class DieOnSprayComponent extends MapObjectComponent {
    public constructor() {
        super();
    }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        const field = game_state.world_map.at(position.position);
        if (!field) return [];
        const sprays = field.objects.filter((object) => {
            return object.get(IsSprayComponent);
        });
        if (sprays.length === 0) return [];
        return [new DestroyObjectTask(self.instance_ID)];
    }
}
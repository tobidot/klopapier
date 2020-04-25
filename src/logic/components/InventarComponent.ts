import MapObjectComponent from "./MapObjectComponent"; import MapObject, { ObjectID } from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import { Task } from "../tasks/Task";
import { PositionComponent } from "./PositionComponent";
import IsCollectableComponent from "./IsCollectableComponent copy";
import PickUpItemsTask from "../tasks/PickUpItemsTask";

export default class InventarComponent extends MapObjectComponent {
    public money: number = 0;
    public items: Array<ObjectID> = [];
    public size: number = 12;
    public holding: MapObject | null = null;

    public constructor() {
        super();
    }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        const field = game_state.world_map.at(position.position);
        if (!field) return [];
        const tasks = field.objects.filter((object) => {
            return object.get(IsCollectableComponent) !== null;
        }).map((object) => {
            return new PickUpItemsTask(self.instance_ID, position.position);
        });
        return tasks;
    }

    public has(item: ObjectID) {
        return this.items.includes(item);
    }

    public remove(item: ObjectID) {
        let found = false;
        this.items = this.items.filter((current) => {
            if (!found && current === item) {
                found = true;
                return false;
            }
            return true;
        });
    }
}
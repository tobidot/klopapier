import MapObjectComponent from "./MapObjectComponent"; import MapObject, { ObjectID } from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import { Task } from "../tasks/Task";
import { PositionComponent } from "./PositionComponent";
import IsCollectableComponent from "./IsCollectableComponent";
import PickUpItemsTask from "../tasks/PickUpItemsTask";
import { MapObjectTypeID } from "../../assets/MapObjectResources";
import DestroyObjectTask from "../tasks/DestroyObjectTask";

export default class InventarComponent extends MapObjectComponent {
    public money: number = 0;
    public items: Array<ObjectID> = [];
    public size: number = 12;
    public holding: MapObject | null = null;

    public constructor() {
        super();
    }

    public handle(game_state: GameState, task: Task): GameState {
        if (!(task instanceof DestroyObjectTask)) return game_state;
        this.items = this.items.filter((object_id) => object_id !== task.object_id);
        return game_state;
    }

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        const field = game_state.world_map.at(position.position);
        if (!field) return [];
        let tasks: Task[] = field.objects.filter((object) => {
            return object.get(IsCollectableComponent) !== null;
        }).map<Task>((object) => {
            return new PickUpItemsTask(self.instance_ID, position.position);
        });
        tasks.push(...(this.update_inventar_items(delta_seconds, self, game_state)));
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

    public update_inventar_items(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        // update items
        const inventar = self.get(InventarComponent);
        if (!inventar) return [];
        return inventar.items.flatMap((object_id) => {
            const object = MapObject.get(object_id);
            if (!object) throw new Error('Invalid Object ID in Inventar');
            return object.update(delta_seconds, game_state);
        });
    }
}
import MapObjectComponent from "./MapObjectComponent";
import { GameState } from "../../../../main/GameState";
import MapObject from "../abstract/MapObject";
import { Task } from "../../../flow/Task";
import { create_timed_array_elements } from "../../../../ts_library/utility/Timed";
import { PositionComponent } from "./PositionComponent";

export default class PlayerControlledComponent extends MapObjectComponent {
    public static NAME = "player_controlled";
    private every_second = create_timed_array_elements(1);

    constructor() {
        super(PlayerControlledComponent.NAME);
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        let tasks: Task[] = [];
        tasks = this.every_second(delta_seconds).map(() => {
            return {
                task: "move_object",
                source: position.position,
                object: self,
                target: position.position.add({ x: 1, y: 0 }),
            }
        });
        return tasks;

    }
}
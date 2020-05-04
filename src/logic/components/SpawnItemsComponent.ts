import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../objects/MapObject";
import Spray from "../objects/Spray";
import { GameState } from "../../main/GameState";
import CreateObjectTask from "../tasks/CreateObjectTask";
import { Task } from "../tasks/Task";
import { PositionComponent, CollisionGroups } from "./PositionComponent";

export default class SpawnItemsComponent extends MapObjectComponent {
    public type: { (game_state: GameState): MapObject } = () => new Spray;
    public interval_in_seconds: number = 10;
    public current_timer: number = 0;

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        if ((this.current_timer -= delta_seconds) > 0) return [];
        this.current_timer += this.interval_in_seconds;
        const position = self.get(PositionComponent);
        if (!position) return [];
        return [new CreateObjectTask(this.type, position.position, CollisionGroups.COLLECTABLE)];
    }
} 
import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../objects/MapObject";
import { GameState } from "../../main/GameState";
import DestroyObjectTask from "../tasks/DestroyObjectTask";
import { Task } from "../tasks/Task";

export default class ChargesComponent extends MapObjectComponent {
    public charges_left: number = 3;

    public update(delta_seconds: number, self: MapObject, game_state: GameState): Task[] {
        if (this.charges_left <= 0) return [new DestroyObjectTask(self.instance_ID)];
        return [];
    }
}
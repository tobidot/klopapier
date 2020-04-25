import MapObjectComponent from "./MapObjectComponent";
import { GameState } from "../../main/GameState";
import { Task } from "../tasks/Task";
import MapObject from "../objects/MapObject";
import DestroyObjectTask from "../tasks/DestroyObjectTask";

export default class HitPointsComponent extends MapObjectComponent {
    public current: number = 10;
    public max: number = 10;

    public update(delta_seconds: number, self: MapObject): Task[] {
        if (this.current <= 0) return [new DestroyObjectTask(self.instance_ID)];
        return [];
    }
}
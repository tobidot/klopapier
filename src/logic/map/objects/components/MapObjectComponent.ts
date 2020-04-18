import { MapEvent } from "../../events/MapEvent";
import { Task } from "../../../flow/Task";

export default class MapObjectComponent {
    constructor(public name: string) { }

    public update(delta_seconds: number): Task[] { return []; }
    public handle(event: MapEvent) { };
}
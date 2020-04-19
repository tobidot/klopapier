import { MapEvent } from "../../events/MapEvent";
import { Task } from "../../../flow/Task";
import MapObject from "../abstract/MapObject";

export default class MapObjectComponent {
    constructor(public name: string) { }

    public update(delta_seconds: number, self: MapObject): Task[] { return []; }
    public handle(event: MapEvent) { };
}
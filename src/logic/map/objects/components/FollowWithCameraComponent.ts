import MapObject, { ObjectID } from "../abstract/MapObject";
import MapObjectComponent from "./MapObjectComponent";
import { Task } from "../../../flow/Task";
import { PositionComponent } from "./PositionComponent";

export default class FollowWithCameraComponent extends MapObjectComponent {
    public static NAME = "follow_with_camera";

    public constructor() {
        super(FollowWithCameraComponent.NAME);
    }

    public update(delta_seconds: number, self: MapObject): Task[] {
        const position = self.get(PositionComponent);
        if (!position) return [];
        const task = {
            task: "set_camera_position",
            new_position: position.position,
        };
        return [task];
    }
}
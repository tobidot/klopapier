import MapObjectComponent from "./MapObjectComponent";
import MapObject, { ObjectID } from "../abstract/MapObject";
import { Task } from "../../../flow/Task";

export default class HungerComponent extends MapObjectComponent {
    public static NAME = "hunger";
    public object_id: ObjectID;
    public urge_to_eat: number = 0;
    public ticks_before_damage: number = 0;
    public every_second = create_timed_array_elements(1);

    public constructor(object: MapObject) {
        super(HungerComponent.NAME);
        this.object_id = object.instance_ID;
    }

    public update(delta_seconds: number): Task[] {
        this.urge_to_eat = Math.min(this.urge_to_eat + delta_seconds * 2, 100);
        let tasks: Task[] = [];
        return this.every_second(delta_seconds).map(() => {
            return {
                name: "damage_object",
                target_id: this.object_id,
                amount: 10,
            }
        });
    }
}
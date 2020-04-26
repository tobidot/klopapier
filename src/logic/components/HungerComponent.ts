import MapObjectComponent from "./MapObjectComponent"; import MapObject, { ObjectID } from "../objects/MapObject"; import { create_timed_array_elements } from "../../ts_library/utility/Timed"; import { Task } from "../tasks/Task"; import DamageObjectTask from "../tasks/DamageObjectTask";


export default class HungerComponent extends MapObjectComponent {
    public object_id: ObjectID;
    public urge_to_eat: number = 0;
    public ticks_before_damage: number = 0;
    public every_second = create_timed_array_elements(1);

    public constructor(object: MapObject) {
        super();
        this.object_id = object.instance_ID;
    }

    public update(delta_seconds: number): Task[] {
        this.urge_to_eat = Math.min(this.urge_to_eat + delta_seconds * 2, 100);
        if (this.urge_to_eat < 100) return [];
        return this.every_second(delta_seconds).map((): DamageObjectTask => {
            return new DamageObjectTask(this.object_id, 0.25);
        });
    }
}
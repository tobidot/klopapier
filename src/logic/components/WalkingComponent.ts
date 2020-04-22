import MapObjectComponent from "./MapObjectComponent"; import WorldMap from "../map/WorldMap"; import { TerrainTypeID } from "../../assets/TerrainResources"; import MapObject from "../objects/MapObject"; import { create_timed_array_elements } from "../../ts_library/utility/Timed"; import { Task } from "../tasks/Task";


export default class WalkingComponent extends MapObjectComponent {
    public static NAME = "walking";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public chance_to_move = 0.5;
    public every_step = create_timed_array_elements(5);

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(WalkingComponent.NAME);
        this.map = map;
        this.object = object;
    }

    public update(delta_seconds: number): Task[] {
        return this.every_step(delta_seconds).flatMap((): Task[] => {
            if (Math.random() < this.chance_to_move) {
                // const target = this.object.get_position().add(Point.create_random_direction_non_diagonal());
                //this.object.move_to(this.map, target);
                return [];
            } else {
                return [];
            }
        });
    }
}
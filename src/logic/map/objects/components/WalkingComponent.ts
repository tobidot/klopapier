import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";
import { Direction } from "../../../../ts_library/space/Direction";
import { Point } from "../../../../ts_library/space/SimpleShapes";

export default class WalkingComponent extends MapObjectComponent {
    public static NAME = "walking";
    private map: WorldMap<TerrainTypeID>;
    private object: MapObject;

    public steps_interval_in_seconds = 5
    public time_to_next_step = 0;
    public chance_to_move = 0.5;

    public constructor(map: WorldMap<TerrainTypeID>, object: MapObject) {
        super(WalkingComponent.NAME);
        this.map = map;
        this.object = object;
    }

    public update(delta_seconds: number) {
        this.time_to_next_step -= delta_seconds;
        if (this.time_to_next_step <= 0) {
            this.time_to_next_step += this.steps_interval_in_seconds;
            if (Math.random() < this.chance_to_move) {
                const target = this.object.get_position().add(Point.create_random_direction_non_diagonal());
                this.object.move_to(this.map, target);
            }
        }
    }
}
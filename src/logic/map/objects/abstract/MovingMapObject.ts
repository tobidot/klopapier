import MapObject from "./MapObject";
import { Direction, direction_invert } from "../../../../ts_library/space/Direction";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import { point_to_direction } from "../../../../ts_library/conversion/fromPoint";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";
import { direction_to_point } from "../../../../ts_library/conversion/fromDirection";

export default class MovingMapObject extends MapObject {
    private _look_direction: Direction = Direction.LEFT;
    private rest_time_to_finish_movement: number = 0;
    public time_to_finish_movement: number = 0.25;
    public comming_from_direction: Direction = Direction.LEFT;

    set look_direction(direction: Direction) {
        this._look_direction = direction;
    }

    get look_direction(): Direction {
        return this._look_direction;
    }

    public touched_by(): this {
        return this;
    }

    public move_to(map: WorldMap<TerrainTypeID>, target: Point): boolean {
        if (this.rest_time_to_finish_movement > 0) {
            return false;
        } else {
            let moved_vector = target.sub(this.get_position());
            this._look_direction = point_to_direction(moved_vector);
            if (super.move_to(map, target)) {
                this.rest_time_to_finish_movement = this.time_to_finish_movement;
                this.comming_from_direction = direction_invert(this.look_direction);
                return true;
            }
            return false;
        }
    }

    public update(delta_seconds: number) {
        this.rest_time_to_finish_movement -= delta_seconds;
        return super.update(delta_seconds);
    }

    public get moving_progress(): false | number {
        if (this.rest_time_to_finish_movement <= 0) return false;
        return this.rest_time_to_finish_movement / this.time_to_finish_movement;
    }

    public get moving_offset(): Point {
        const progress = this.moving_progress;
        if (progress === false) return new Point(0, 0);
        return direction_to_point(this.comming_from_direction, progress);
    }
}
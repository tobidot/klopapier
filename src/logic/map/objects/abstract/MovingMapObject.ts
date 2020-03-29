import MapObject from "./MapObject";
import { Direction } from "../../../../ts_library/space/Direction";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import { point_to_direction } from "../../../../ts_library/conversion/fromPoint";
import Field from "../../Field";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";

export default class MovingMapObject extends MapObject {
    private _look_direction: Direction = Direction.LEFT;

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
        let moved_vector = target.sub(this.get_position());
        this._look_direction = point_to_direction(moved_vector);
        return super.move_to(map, target);
    }
}
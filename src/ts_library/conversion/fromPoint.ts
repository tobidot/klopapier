import { Point } from "../space/SimpleShapes";
import { Direction } from "../space/Direction";

export function point_to_direction(point: Point): Direction {
    if (Math.abs(point.x) > Math.abs(point.y)) {
        if (point.x < 0) return Direction.LEFT;
        else return Direction.RIGHT;
    } else {
        if (point.y < 0) return Direction.UP;
        else return Direction.DOWN;
    }
}
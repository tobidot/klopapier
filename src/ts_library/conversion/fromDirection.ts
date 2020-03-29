import { Point } from "../space/SimpleShapes";
import { Direction } from "../space/Direction";

interface DirectionControlable {
    move_by(move: Point): DirectionControlable;
}

export function move_by_direction(target: DirectionControlable, direction: Direction, step: number) {
    switch (direction) {
        case Direction.LEFT: return target.move_by(new Point(-step, 0));
        case Direction.RIGHT: return target.move_by(new Point(step, 0));
        case Direction.UP: return target.move_by(new Point(0, -step));
        case Direction.DOWN: return target.move_by(new Point(0, step));
    }
    return target;
}

export function direction_to_point(direction: Direction, step: number): Point {
    switch (direction) {
        case Direction.LEFT: return new Point(-step, 0);
        case Direction.RIGHT: return new Point(step, 0);
        case Direction.UP: return new Point(0, -step);
        case Direction.DOWN: return new Point(0, step);
    }
}

export enum Direction {
    LEFT, UP, RIGHT, DOWN
};

export function direction_invert(direction: Direction) {
    switch (direction) {
        case Direction.LEFT: return Direction.RIGHT;
        case Direction.RIGHT: return Direction.LEFT;
        case Direction.UP: return Direction.DOWN;
        case Direction.DOWN: return Direction.UP;
    }
}
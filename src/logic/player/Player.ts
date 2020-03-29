import { Point } from "../../ts_library/space/SimpleShapes";
import { Direction } from "../../ts_library/space/Direction";

export default class Player {
    private position: Point = new Point(0, 0);
    constructor() {

    }
    public move(direction: Direction) {
        switch (direction) {
            case Direction.LEFT: this.position = this.position.move_by(-1, 0); break;
            case Direction.UP: this.position = this.position.move_by(0, -1); break;
            case Direction.RIGHT: this.position = this.position.move_by(1, 0); break;
            case Direction.DOWN: this.position = this.position.move_by(0, 1); break;
        }
    }
}
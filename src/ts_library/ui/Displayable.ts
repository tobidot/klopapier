import DisplayTarget from "../graphic/DisplayTarget"
import { Point2 } from "../space/Coordinate";

export interface Displayable {
    display(target: DisplayTarget<Point2, number>): void;
}
import MapObjectComponent from "./MapObjectComponent";
import { Point } from "../../../../ts_library/space/SimpleShapes";

export class PositionComponent extends MapObjectComponent {
    public static NAME = "position";
    public position: Point = new Point(0, 0);

    constructor() {
        super(PositionComponent.NAME);
    }

}
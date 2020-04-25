import MapObjectComponent from "./MapObjectComponent";
import { Direction } from "../../ts_library/space/Direction";

export default class MovingComponent extends MapObjectComponent {
    public static NAME = "moving";
    public look_direction: Direction = Direction.DOWN;

    constructor() {
        super();
    }
}
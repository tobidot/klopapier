import Terrain from "./Terrain";
import { Point } from "../../ts_library/space/SimpleShapes";
import MapObject from "../objects/MapObject";

export default interface Field {
    location: Point;
    terrain: Terrain;
    objects: Array<MapObject>;
    // effects: Array<MapEffect>;
}
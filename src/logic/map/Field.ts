import Terrain from "./Terrain";
import MapObject from "./objects/abstract/MapObject";
import { Point } from "../../ts_library/space/SimpleShapes";

export default interface Field {
    location: Point;
    terrain: Terrain;
    objects: Array<MapObject>;
    // effects: Array<MapEffect>;
}
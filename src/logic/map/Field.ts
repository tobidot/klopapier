import Terrain from "./Terrain";
import MapObject from "./objects/abstract/MapObject";
import MovingMapObject from "./objects/abstract/MovingMapObject";

export default interface Field {
    x: number;
    y: number;
    terrain: Terrain;
    object: MapObject | null;
}
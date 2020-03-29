import Terrain from "./Terrain";
import MapObject from "./objects/abstract/MapObject";
import { TerrainTypeID } from "../../assets/TerrainResources";

export default interface Field {
    x: number;
    y: number;
    terrain: Terrain;
    object: MapObject | null;
}
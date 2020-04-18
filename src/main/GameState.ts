import WorldMap from "../logic/map/WorldMap";
import { TerrainTypeID } from "../assets/TerrainResources";
import { Point } from "../ts_library/space/SimpleShapes";
import MapObject from "../logic/map/objects/abstract/MapObject";
import { GameMode } from "./GameMode";

export interface GameState {
    modus: GameMode;

    world_map: WorldMap<TerrainTypeID>;
    time_of_day: number;
    camera_position: Point;
    current_level: number;

}
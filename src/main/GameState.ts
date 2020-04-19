import WorldMap from "../logic/map/WorldMap";
import { TerrainTypeID } from "../assets/TerrainResources";
import { Point } from "../ts_library/space/SimpleShapes";
import MapObject from "../logic/map/objects/abstract/MapObject";
import { GameMode } from "./GameMode";
import { Task } from "../logic/flow/Task";

export interface GameState {
    modus: GameMode;
    calculated: GameCalculatedState;

    world_map: WorldMap<TerrainTypeID>;
    day: number;
    time_of_day: number;
    camera_position: Point;
    current_level: number;

    tasks: Task[];
}

export interface GameCalculatedState {
    has_won: boolean;
    has_lost: boolean;
    fps: number;
}

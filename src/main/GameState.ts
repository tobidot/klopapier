import WorldMap from "../logic/map/WorldMap";
import { TerrainTypeID } from "../assets/TerrainResources";
import { Point } from "../ts_library/space/SimpleShapes";
import { GameMode } from "./GameMode";
import { Task } from "../logic/tasks/Task";
import { ObjectID } from "../logic/objects/MapObject";

export interface GameState {
    calculated: GameCalculatedState;
    modus: GameMode;
    post_game_stats: PostGameStats;

    world_map: WorldMap<TerrainTypeID>;
    day: number;
    time_of_day: number;
    camera_position: Point;
    current_level: number;

    tasks: Task[];
    selected: ObjectID | null;
}

export interface GameCalculatedState {
    remaining_virusses: number;
    remaining_humans: number;
    // has_won: boolean;
    // has_lost: boolean;
    // fps: number;
}


export interface PostGameStats {
    won_or_lost: GameResult;
}

export enum GameResult {
    WON,
    LOST,
    TIE
}
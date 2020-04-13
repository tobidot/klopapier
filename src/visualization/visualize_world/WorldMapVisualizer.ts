import ImageManager from "../../manager/ImageManager";
import WorldMap from "../../logic/map/WorldMap";
import { TerrainTypeID } from "../../assets/TerrainResources";
import { Point, Rect } from "../../ts_library/space/SimpleShapes";

export class Camera {
    private _map_source_rect: Rect = Rect.from_boundries(0, 0, 1, 1);
    private _display_target_rect: Rect = Rect.from_boundries(0, 0, 1, 1);
    public get map_source_rect(): Rect { return this._map_source_rect; }
    public set map_source_rect(rect: Rect) { this._map_source_rect = rect; }
    public get display_target_rect(): Rect { return this._display_target_rect; }
    public set display_target_rect(rect: Rect) { this._display_target_rect = rect; }
}

export abstract class WorldMapVisualizer {
    public readonly camera: Camera = new Camera();

    constructor(
        protected context: CanvasRenderingContext2D,
        protected image_manager: ImageManager) {
    }

    abstract display(world_map: WorldMap<TerrainTypeID>, delta_seconds: number): void;
}
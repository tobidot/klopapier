import ImageManager from "../../manager/ImageManager";
import WorldMap from "../../logic/map/WorldMap";
import { TerrainTypeID } from "../../assets/TerrainResources";
import { Point, Rect } from "../../ts_library/space/SimpleShapes";

export class Camera {
    public readonly map_source_rect: Rect = Rect.from_boundries(0, 0, 1, 1);
    public readonly display_target_rect: Rect = Rect.from_boundries(0, 0, 1, 1);
}

export abstract class WorldMapVisualizer {
    public readonly camera: Camera = new Camera();

    constructor(
        protected context: CanvasRenderingContext2D,
        protected image_manager: ImageManager) {
    }

    abstract display(world_map: WorldMap<TerrainTypeID>, delta_seconds: number): void;
}
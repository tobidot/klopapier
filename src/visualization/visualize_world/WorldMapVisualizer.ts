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

    public get_field_size_in_pixels() {
        const x = this.display_target_rect.width() / this.map_source_rect.width();
        const y = this.display_target_rect.height() / this.map_source_rect.height();
        return { x, y };
    }

    public get_camera_without_stretching(): Camera {
        const original_field_size = this.get_field_size_in_pixels();
        let camera = new Camera();
        camera.map_source_rect = this.map_source_rect;
        camera.display_target_rect = this.display_target_rect;

        const space_x = (original_field_size.x - original_field_size.y) * this.map_source_rect.width();
        const space_y = (original_field_size.y - original_field_size.x) * this.map_source_rect.height();
        if (space_x > 0) {
            camera.display_target_rect.move_by(space_x / 2, 0);
            camera.display_target_rect.right -= space_x;
        } else if (space_y > 0) {
            camera.display_target_rect.move_by(0, space_y);
            camera.display_target_rect.bottom -= space_y;
        }
        return camera;
    }
}

export abstract class WorldMapVisualizer {
    public readonly camera: Camera = new Camera();

    constructor(
        protected context: CanvasRenderingContext2D,
        protected image_manager: ImageManager) {
    }

    abstract display(world_map: WorldMap<TerrainTypeID>, delta_seconds: number): void;
}
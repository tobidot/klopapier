import WorldMap from "../../../logic/map/WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import ImageManager from "../../../manager/ImageManager";
import { WorldMapVisualizer, Camera } from "../WorldMapVisualizer";
import FieldDrawer from "./FieldDrawer";
import { TerrainDrawer } from "./TerrainDrawer";
import { ObjectDrawer } from "./ObjectDrawer";
import { Rect } from "../../../ts_library/space/SimpleShapes";

export default class WorldMapVisualizerDefault extends WorldMapVisualizer {
    private field_drawer: FieldDrawer;
    private offscreen_canvas: OffscreenCanvas;
    private offscreen_context: OffscreenCanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, image_manager: ImageManager) {
        super(context, image_manager);

        const [offscreen_canvas, offscreen_context] = WorldMapVisualizerDefault.create_offscreen_canvas();
        this.field_drawer = (new FieldDrawer(offscreen_context, this.image_manager));

        this.offscreen_canvas = offscreen_canvas;
        this.offscreen_context = offscreen_context;
        this.field_drawer.add(new TerrainDrawer(this.image_manager));
        this.field_drawer.add(new ObjectDrawer(this.image_manager));
        this.field_drawer.camera = this.camera;
        offscreen_context.imageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }

    public static create_offscreen_canvas(): [OffscreenCanvas, OffscreenCanvasRenderingContext2D] {
        const offscreen_canvas = new OffscreenCanvas(800, 600);
        const context = offscreen_canvas.getContext('2d');
        if (!context) throw new Error('Unable to create context');
        return [offscreen_canvas, context];
    }

    public display(world_map: WorldMap<TerrainTypeID>, delta_seconds: number) {
        const target_width = this.camera.display_target_rect.right;
        const target_height = this.camera.display_target_rect.bottom;
        if (Math.abs(target_width - this.offscreen_canvas.width) || Math.abs(target_height - this.offscreen_canvas.height)) {
            this.offscreen_canvas.width = target_width;
            this.offscreen_canvas.height = target_height;
            this.offscreen_context.imageSmoothingEnabled = false;
        }
        this.offscreen_context.clearRect(
            this.camera.display_target_rect.left,
            this.camera.display_target_rect.top,
            target_width,
            target_height
        );
        const source_rect = Rect.from_boundries(
            Math.trunc(this.camera.map_source_rect.left),
            Math.trunc(this.camera.map_source_rect.top),
            Math.ceil(this.camera.map_source_rect.right),
            Math.ceil(this.camera.map_source_rect.bottom),
        );
        this.field_drawer.get_drawer_functions().forEach((draw) => {
            world_map.map_fields_in_rect(source_rect, draw);
        });

        const image_data = this.offscreen_context.getImageData(
            this.camera.display_target_rect.left,
            this.camera.display_target_rect.top,
            target_width,
            target_height
        );
        this.context.putImageData(image_data,
            this.camera.display_target_rect.left, this.camera.display_target_rect.top,
            0, 0,
            target_width, target_height,
        );
    }
}


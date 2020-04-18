import { Point, RectSize } from "../../../ts_library/space/SimpleShapes";
import Field from "../../../logic/map/Field";
import ImageManager from "../../../manager/ImageManager";
import { Camera } from "../WorldMapVisualizer";
import { TerrainDrawer } from "./TerrainDrawer";
import { FieldPartDrawer } from "./FieldPartDrawer";
import { Size2 } from "../../../ts_library/space/Coordinate";


export interface VisualFieldData {
    [key: string]: any;
}
export default class FieldDrawer {
    public image_manager: ImageManager;
    public context: CanvasRenderingContext2D;

    public camera: Camera = new Camera();

    private next_field_pixel_size: Size2 = { x: 32, y: 32 };
    private next_field_screen_position: Point = new Point(0, 0);
    private partial_field_drawers: Array<FieldPartDrawer> = [];

    constructor(
        context: CanvasRenderingContext2D,
        image_manager: ImageManager) {
        this.context = context;
        this.image_manager = image_manager;
    }

    protected get_visual_data_for_field(field: Field): VisualFieldData {
        return {};
    }

    public add(field_part_drrawer: FieldPartDrawer) {
        this.partial_field_drawers.push(field_part_drrawer);
    }

    public get_drawer_functions(): Array<((field: Field) => any)> {
        const non_distorted_camera = this.camera.get_camera_without_stretching();
        this.next_field_pixel_size = non_distorted_camera.get_field_size_in_pixels();

        return this.partial_field_drawers.map((part_drawer) => {
            return (field: Field) => {
                const data = this.get_visual_data_for_field(field);
                this.next_field_screen_position = field.location
                    .sub(non_distorted_camera.map_source_rect.top_left())
                    .mul(this.next_field_pixel_size)
                    .add(non_distorted_camera.display_target_rect.top_left());
                part_drawer.draw(this.draw_part_field_function, field, data);
            }
        });
    };

    private draw_part_field_function = (image: HTMLImageElement, offset: Point = new Point(0, 0)) => {
        const field_size = this.next_field_pixel_size;
        const screen_position = this.next_field_screen_position.add(offset);
        this.context.drawImage(image, screen_position.x, screen_position.y, field_size.x, field_size.y);
    }
}
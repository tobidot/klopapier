import { Point, RectSize } from "../../../ts_library/space/SimpleShapes";
import Field from "../../../logic/map/Field";
import ImageManager from "../../../manager/ImageManager";
import { Camera } from "../WorldMapVisualizer";
import { TerrainDrawer } from "./TerrainDrawer";
import { FieldPartDrawer } from "./FieldPartDrawer";


export interface VisualFieldData {
    [key: string]: any;
}
export default class FieldDrawer {
    public image_manager: ImageManager;
    public context: CanvasRenderingContext2D;

    public camera: Camera = new Camera();
    private field_size_in_pixels: number = 32;

    private next_field_screen_position: Point = new Point(0, 0);
    private partial_field_drawers: Array<FieldPartDrawer> = [];

    constructor(
        context: CanvasRenderingContext2D,
        image_manager: ImageManager) {
        this.context = context;
        this.image_manager = image_manager;

        this.partial_field_drawers.push(new TerrainDrawer(this.image_manager));
    }

    protected get_visual_data_for_field(field: Field): VisualFieldData {
        return {};
    }

    public get_drawer_functions(): Array<((field: Field) => any)> {
        return this.partial_field_drawers.map((part_drawer) => {
            return (field: Field) => {
                const data = this.get_visual_data_for_field(field);
                this.next_field_screen_position = field.location.sub(this.camera.map_source_rect.center()).mul(this.field_size_in_pixels);
                part_drawer.draw(this.draw_part_field_function, field, data);
            }
        });
    };

    private draw_part_field_function = (image: HTMLImageElement, offset: Point = new Point(0, 0)) => {
        const screen_position = this.next_field_screen_position.add(offset);
        this.context.drawImage(image, screen_position.x, screen_position.y, this.field_size_in_pixels, this.field_size_in_pixels);
    }
}
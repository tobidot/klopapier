import { RectSize, Point } from "../ts_library/space/SimpleShapes";
import InventarComponent from "../logic/map/objects/components/InventarComponent";
import MapObject from "../logic/map/objects/abstract/MapObject";
import ImageManager from "../manager/ImageManager";
import { ImageID } from "../assets/ImageResources";

export default class InventarOnScreen {
    private images: ImageManager;
    private slot_page_size: RectSize;
    private display_size: RectSize;
    private context: CanvasRenderingContext2D;
    private cell_size: RectSize;
    private readonly display_money_height: number = 50;

    constructor(context: CanvasRenderingContext2D, images: ImageManager, display_size: RectSize, slot_page_size: RectSize) {
        this.display_size = display_size;
        this.images = images;
        this.slot_page_size = slot_page_size;
        this.context = context;
        this.cell_size = new Point(
            this.display_size.x / this.slot_page_size.x,
            (this.display_size.y - this.display_money_height) / this.slot_page_size.y
        );
    }

    public display(object: MapObject) {
        this.context.translate(650, 0);
        const inventar = object.components.get<InventarComponent>(InventarComponent);
        if (inventar) {
            this.context.font = '32px';
            this.context.fillStyle = 'yellow';
            this.context.fillText(inventar.money.toString() + '$', 16, 32);

            const items_per_page = this.slot_page_size.x * this.slot_page_size.y;
            inventar.items.slice(0, items_per_page).forEach((item, index) => {
                const x = index % this.slot_page_size.x
                const y = Math.trunc(index / this.slot_page_size.x);
                const max_size = Math.min(this.cell_size.x, this.cell_size.y) - 20;
                const screen_x = x * this.cell_size.x + (this.cell_size.x - max_size) / 2;
                const screen_y = y * this.cell_size.y + (this.cell_size.y - max_size) / 2 + 50;

                const image = this.images.get(ImageID.OBJECTS_FIRE);
                this.context.drawImage(image, screen_x, screen_y, max_size, max_size)
            });
        }
        this.context.resetTransform();
    }
}
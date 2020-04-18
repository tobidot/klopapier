import ImageManager from "../../manager/ImageManager";
import { image_resources } from "../../assets/ImageResources";
import { RectSize, Rect } from "../../ts_library/space/SimpleShapes";
import MapObject from "../../logic/map/objects/abstract/MapObject";
import HungerComponent from "../../logic/map/objects/components/HungerComponent";

export default class HungerOnScreen {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private display_rect: Rect;

    constructor(context: CanvasRenderingContext2D, images: ImageManager, display_rect: Rect) {
        this.context = context;
        this.images = images;
        this.display_rect = display_rect;
    }

    display(object: MapObject) {
        const hunger = object.get(HungerComponent);
        if (!hunger) return;
        const bar_width = this.display_rect.width();
        const percentage = 1 - (hunger.urge_to_eat / 100.0);

        this.context.font = "32px sans-serif";

        this.context.fillStyle = "gray";
        this.context.fillRect(this.display_rect.left, this.display_rect.top, bar_width, this.display_rect.height());
        this.context.fillStyle = "yellow";
        this.context.fillRect(this.display_rect.left, this.display_rect.top, percentage * bar_width, this.display_rect.height());
        this.context.fillStyle = "black";
        this.context.fillText('Hunger', Math.max(10, percentage * bar_width - 130), this.display_rect.top + this.display_rect.height() / 2 + 12);

    }
}
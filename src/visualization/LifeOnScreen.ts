import ImageManager from "../manager/ImageManager";
import { image_resources } from "../assets/ImageResources";
import { RectSize, Rect } from "../ts_library/space/SimpleShapes";
import MapObject from "../logic/map/objects/abstract/MapObject";
import HungerComponent from "../logic/map/objects/components/HungerComponent";
import LivingMapObject from "../logic/map/objects/abstract/LivingMapObject";

export default class LifeOnScreen {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private display_rect: Rect;

    constructor(context: CanvasRenderingContext2D, images: ImageManager, display_rect: Rect) {
        this.context = context;
        this.images = images;
        this.display_rect = display_rect;
    }

    display(object: MapObject) {
        if (!(object instanceof LivingMapObject)) return;
        const bar_width = this.display_rect.width() - 50;
        const percentage = (object.get_health_percentage());

        this.context.fillStyle = "red";
        this.context.fillStyle = "32px sans-serif";

        this.context.fillRect(this.display_rect.left, this.display_rect.top, bar_width * percentage, this.display_rect.height() * 0.25);
        this.context.fillText('Health', bar_width * percentage, this.display_rect.top + 20);

    }
}
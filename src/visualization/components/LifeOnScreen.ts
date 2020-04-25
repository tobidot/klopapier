import ImageManager from "../../manager/ImageManager";
import { Rect } from "../../ts_library/space/SimpleShapes";
import MapObject from "../../logic/objects/MapObject";
import HitPointsComponent from "../../logic/components/HitPointsComponent";

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
        const hitpoints = object.get(HitPointsComponent);
        if (!hitpoints) return;
        if (hitpoints.current <= 0) return;
        const bar_width = this.display_rect.width();
        const percentage = (hitpoints.current / hitpoints.max);

        this.context.font = "32px sans-serif";

        this.context.fillStyle = "gray";
        this.context.fillRect(this.display_rect.left, this.display_rect.top, bar_width, this.display_rect.height());
        this.context.fillStyle = "red";
        this.context.fillRect(this.display_rect.left, this.display_rect.top, bar_width * percentage, this.display_rect.height());
        this.context.fillStyle = "black";
        this.context.fillText('Health', Math.max(10, percentage * bar_width - 130), this.display_rect.top + this.display_rect.height() / 2 + 12);

    }
}
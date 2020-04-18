import ImageManager from "../../manager/ImageManager";
import MapObject from "../../logic/map/objects/abstract/MapObject";
import HungerComponent from "../../logic/map/objects/components/HungerComponent";
import { Rect } from "../../ts_library/space/SimpleShapes";

export default class InfectionOnScreen {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private display_rect: Rect;

    constructor(context: CanvasRenderingContext2D, images: ImageManager, display_rect: Rect) {
        this.context = context;
        this.images = images;
        this.display_rect = display_rect;
    }

    display(infection_count: number) {
        if (infection_count < 20) {
            this.context.fillStyle = "white";
        } else if (infection_count < 40) {
            this.context.fillStyle = "green";
        } else if (infection_count < 100) {
            this.context.fillStyle = "orange";
        } else if (infection_count < 250) {
            this.context.fillStyle = "red";
        }

        this.context.font = "32px monospace";
        this.context.fillText('Count: ' + infection_count, this.display_rect.left, this.display_rect.top + this.display_rect.height() / 2 + 12);
    }
}
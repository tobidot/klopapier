import ImageManager from "../manager/ImageManager";
import { image_resources, ImageID } from "../assets/ImageResources";
import { RectSize, Rect } from "../ts_library/space/SimpleShapes";
import MapObject from "../logic/map/objects/abstract/MapObject";
import HungerComponent from "../logic/map/objects/components/HungerComponent";

export default class DayTimeOnScreen {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private display_rect: Rect;

    constructor(context: CanvasRenderingContext2D, images: ImageManager, display_rect: Rect) {
        this.context = context;
        this.images = images;
        this.display_rect = display_rect;
    }

    display(time_of_day_percent: number, day: number) {
        const image_moon = this.images.get(ImageID.OBJECT__MOON);
        const image_sun = this.images.get(ImageID.OBJECT__SUN);
        const center = this.display_rect.center();
        const size = 32;
        const circle_radius_x = this.display_rect.width() / 2 - size / 2;
        const circle_radius_y = this.display_rect.height() / 2 - size / 2;

        const sun_strength = Math.min(1, Math.max(-0.1, Math.sin((time_of_day_percent - 0.25) * Math.PI * 2)) + 0.2);
        const moon_strength = Math.min(1, Math.max(-0.1, -Math.sin((time_of_day_percent - 0.25) * Math.PI * 2)) + 0.2);

        const sx = center.x - Math.sin(time_of_day_percent * Math.PI * 2) * circle_radius_x - size / 2;
        const sy = center.y + Math.cos(time_of_day_percent * Math.PI * 2) * circle_radius_y - size / 2;
        const mx = center.x + Math.sin(time_of_day_percent * Math.PI * 2) * circle_radius_x - size / 2;
        const my = center.y - Math.cos(time_of_day_percent * Math.PI * 2) * circle_radius_y - size / 2;

        this.context.globalAlpha = sun_strength;
        this.context.drawImage(image_sun, sx, sy, 32, 32);
        this.context.globalAlpha = moon_strength;
        this.context.drawImage(image_moon, mx, my, 32, 32);
        this.context.globalAlpha = 1;
        this.context.font = "24px fantasy";
        this.context.fillStyle = "white";
        this.context.fillText('Day ' + day, center.x - this.display_rect.width() / 5, center.y + 8);
    }
}
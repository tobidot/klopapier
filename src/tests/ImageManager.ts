import ImageManager from "../manager/ImageManager";
import { image_resources } from "../assets/ImageResources";

function test_image_manager(context: CanvasRenderingContext2D) {
    let image_paths = require('F:\\assets/own/bit-graphic/**/*.png');
    let manager = new ImageManager(image_resources);
    manager.on_progress_listener.add(([progress, image]: [number, HTMLImageElement]) => {
        context.drawImage(image, context.canvas.width / 2 - image.width / 2, context.canvas.height / 2 - image.height / 2);
        console.log(progress);
    });
}
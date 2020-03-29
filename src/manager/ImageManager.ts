import { ListenerSocket } from "../ts_library/ui/Listener";
import { ImageID } from "../assets/ImageResources";

export default class ImageManager {
    private loaded_images_count: number = 0;
    private all_images_count: number = 0;
    private images: Map<number, HTMLImageElement> = new Map();
    public readonly on_progress_listener: ListenerSocket<[number, HTMLImageElement]> = new ListenerSocket();

    constructor(resources: { [id: number]: string }) {
        Object.entries(resources).forEach(([id, image_url]: [string, string]) => {
            const id_number = parseInt(id);
            this.all_images_count++;
            let image = new Image();
            image.src = image_url;
            image.onload = () => {
                this.images.set(parseInt(id), image);
                this.loaded_images_count++;
                this.on_progress_listener.trigger_event([this.get_loaded_percent(), image]);
            };
            image.onerror = () => {
                image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAABlBMVEX/////AADrWueTAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAADpJREFUeNpjYEQDDECEBEACDEgiUC4jgg+VZ4TzYRqQCUaEYmQBuGU4BdC1oBuKbi26w9CdjuE5NAAAL9AAWd4tUzwAAAAASUVORK5CYII=';
                this.images.set(parseInt(id), image);
                this.loaded_images_count++;
                this.on_progress_listener.trigger_event([this.get_loaded_percent(), image]);
                console.error('Image not correctly loaded: ' + (ImageID[id_number]) + ' => ' + image_url);
            }
        });
    }


    get(key: number): HTMLImageElement {
        let image = this.images.get(key);
        if (!image) throw new Error('Image with ID "' + key + '" does not exist.');
        return image;
    }

    async wait_until_loaded() {
        return new Promise((resolve) => {
            if (this.is_loaded()) {
                resolve(this.loaded_images_count);
            } else {
                this.on_progress_listener.add(() => {
                    if (this.is_loaded()) {
                        resolve(this.loaded_images_count);
                    }
                });
            }
        });
    }

    is_loaded(): boolean {
        return this.all_images_count === this.loaded_images_count;
    }

    get_loaded_percent(): number {
        return this.loaded_images_count / this.all_images_count;
    }
}
import { FieldPartDrawer, FieldDrawerPartDraw, VisualFieldData } from "./FieldDrawer";
import ImageManager from "../../../manager/ImageManager";
import Field from "../../../logic/map/Field";



export class EffectDrawer extends FieldPartDrawer {

    constructor(private images: ImageManager) {
        super();
    }

    public draw(draw: FieldDrawerPartDraw, field: Field, visual_data: VisualFieldData) {
        // const image_id = effect.get_image_to_display(new Point(field.x, field.y));
        // if (image_id !== null) {
        //     let image = this.image_manager.get(image_id);
        //     this.context.drawImage(image, image_x, image_y, this.cell_size, this.cell_size);
        // }
    }

}
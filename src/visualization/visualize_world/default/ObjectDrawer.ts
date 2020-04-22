import { VisualFieldData } from "./FieldDrawer";
import ImageManager from "../../../manager/ImageManager";
import Field from "../../../logic/map/Field";;
import { ImageID } from "../../../assets/ImageResources";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { FieldPartDrawer, FieldDrawerPartDraw } from "./FieldPartDrawer";
import MovingComponent from "../../../logic/components/MovingComponent";
import MapObject from "../../../logic/objects/MapObject";



export class ObjectDrawer extends FieldPartDrawer {

    constructor(private images: ImageManager) {
        super();
    }

    public draw(draw: FieldDrawerPartDraw, field: Field, visual_data: VisualFieldData) {
        let object_image_id = ObjectDrawer.get_image_for_object_type(field.objects[field.objects.length - 1]);
        if (object_image_id !== null) {
            let object_image = this.images.get(object_image_id);
            // if (field.objects instanceof MovingMapObject && field.objects.moving_progress !== false) {
            //     const offset: Point = direction_to_point(field.objects.comming_from_direction, field.objects.moving_progress * 32);
            //     draw(object_image, offset);
            // } else {
            draw(object_image);
            // }
        }
    }


    public static get_image_for_object_type(object: MapObject | null): ImageID | null {
        if (!object) return null;
        const moving_component = object.get(MovingComponent);
        switch (object.type) {
            case MapObjectTypeID.PAPER_ROLL:
                return ImageID.OBJECT__PAPER_ROLL;
            case MapObjectTypeID.NUDEL:
                return ImageID.OBJECT__NUDEL4;
            case MapObjectTypeID.SPRAY:
                return ImageID.OBJECT__SPRAY;
            case MapObjectTypeID.WALL:
                return ImageID.OBJECT__WALL2;
            case MapObjectTypeID.FURNITURE1:
                return ImageID.OBJECT__FURNITURE1;
            case MapObjectTypeID.VIRUS:
                return ImageID.UNIT__VIRUS;
            case MapObjectTypeID.PLAYER:
                if (moving_component) {
                    return [ImageID.UNIT__SMILEY_LEFT, ImageID.UNIT__SMILEY_UP, ImageID.UNIT__SMILEY_RIGHT, ImageID.UNIT__SMILEY_DOWN][moving_component.look_direction];
                }
                return ImageID.UNIT__SMILEY_DOWN;
            default:
                console.error('No Image found for Object ' + object.type);
                return null;
        }
    }

}
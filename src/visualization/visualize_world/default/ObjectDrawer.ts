import { VisualFieldData } from "./FieldDrawer";
import ImageManager from "../../../manager/ImageManager";
import Field from "../../../logic/map/Field";;
import { ImageID } from "../../../assets/ImageResources";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { FieldPartDrawer, FieldDrawerPartDraw } from "./FieldPartDrawer";
import MovingComponent from "../../../logic/components/MovingComponent";
import MapObject from "../../../logic/objects/MapObject";
import VisualComponent from "../../../logic/components/VisualComponent";



export class ObjectDrawer extends FieldPartDrawer {
    public static failed_at_object_types: Array<MapObjectTypeID> = [];

    constructor(private images: ImageManager) {
        super();
    }

    public draw(draw: FieldDrawerPartDraw, field: Field, visual_data: VisualFieldData) {
        field.objects.sort((a, b): number => {
            let visual_a = a.get(VisualComponent);
            let visual_b = b.get(VisualComponent);
            return ((visual_a?.priority || 0) - (visual_b?.priority || 0));
        }).map(ObjectDrawer.get_image_for_object_type).forEach((object_image_id: ImageID | null) => {
            if (object_image_id === null) return;
            let object_image = this.images.get(object_image_id);
            // if (field.objects instanceof MovingMapObject && field.objects.moving_progress !== false) {
            //     const offset: Point = direction_to_point(field.objects.comming_from_direction, field.objects.moving_progress * 32);
            //     draw(object_image, offset);
            // } else {
            draw(object_image);
            // }
        });
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
                if (object.type in ObjectDrawer.failed_at_object_types === false) console.error('No custom Image specified for Object ' + object.type);
                ObjectDrawer.failed_at_object_types.push(object.type);
                const visual = object.get(VisualComponent);
                if (!visual) return ImageID.OTHER__ERROR;
                return visual.image;
        }
    }

}
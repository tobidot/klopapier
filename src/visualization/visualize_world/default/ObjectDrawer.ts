import { VisualFieldData } from "./FieldDrawer";
import ImageManager from "../../../manager/ImageManager";
import Field from "../../../logic/map/Field";;
import { ImageID } from "../../../assets/ImageResources";
import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import { FieldPartDrawer, FieldDrawerPartDraw } from "./FieldPartDrawer";
import MovingComponent from "../../../logic/components/MovingComponent";
import MapObject from "../../../logic/objects/MapObject";
import VisualComponent from "../../../logic/components/VisualComponent";
import { PositionComponent } from "../../../logic/components/PositionComponent";
import { Point } from "../../../ts_library/space/SimpleShapes";
import { direction_to_point } from "../../../ts_library/conversion/fromDirection";



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
        }).forEach((object) => {
            const object_image_id: ImageID | null = ObjectDrawer.get_image_for_object_type(object);
            if (object_image_id === null) return;
            let object_image = this.images.get(object_image_id);
            const position = object.get(PositionComponent);
            const moving = object.get(MovingComponent);
            if (!position ||
                !moving ||
                moving.progress === false ||
                moving.previous_position === null) return draw(object_image);
            const offset: Point = position.position.sub(moving.previous_position).mul(moving.progress - 1);
            draw(object_image, offset);
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
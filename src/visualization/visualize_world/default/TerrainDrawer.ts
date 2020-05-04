import ImageManager from "../../../manager/ImageManager"; import Field from "../../../logic/map/Field";
import Terrain from "../../../logic/map/Terrain"; import { ImageID } from "../../../assets/ImageResources";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import { VisualFieldData } from "./FieldDrawer";
import { FieldPartDrawer, FieldDrawerPartDraw } from "./FieldPartDrawer";

export class TerrainDrawer extends FieldPartDrawer {

    constructor(private images: ImageManager) {
        super();
    }

    public draw(draw: FieldDrawerPartDraw, field: Field, visual_data: VisualFieldData) {
        let terrain_image_id = TerrainDrawer.get_image_for_terrain_type(field.terrain);
        if (terrain_image_id !== null) {
            let terrain_image = this.images.get(terrain_image_id);
            draw(terrain_image);
        }
    }

    public static get_image_for_terrain_type(terrain: Terrain): ImageID | null {
        switch (terrain.type) {
            case TerrainTypeID.INDOOR_SHOP:
                return ImageID.TERRAIN__INDOOR_SHOP;
            case TerrainTypeID.OUTDOOR_GRAS:
                return ImageID.TERRAIN__OUTDOOR_GRAS;
            default:
                return null;
        }
    }
}
import ImageManager from "../../../manager/ImageManager"; import Field from "../../../logic/map/Field";
import Terrain from "../../../logic/map/Terrain"; import { ImageID } from "../../../assets/ImageResources";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import { FieldPartDrawer, FieldDrawerPartDraw, VisualFieldData } from "./FieldDrawer";



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
                switch (terrain.variation_key) {
                    case 'with_paper': return ImageID.TERRAIN__INDOOR_SHOP_WITH_PAPER;
                    case 'with_spray': return ImageID.TERRAIN__INDOOR_SHOP_WITH_SPRAY;
                    default: return ImageID.TERRAIN__INDOOR_SHOP;
                }
            case TerrainTypeID.OUTDOOR_GRAS:
                switch (terrain.variation_key) {
                    case 'with_paper': return ImageID.TERRAIN__OUTDOOR_GRAS_WITH_PAPER;
                    case 'with_spray': return ImageID.TERRAIN__OUTDOOR_GRAS_WITH_SPRAY;
                    default: return ImageID.TERRAIN__OUTDOOR_GRAS;
                }
            case TerrainTypeID.INDOOR_PALLETTE: return ImageID.TERRAIN__INDOOR_EMPTY_PALLETTE;
            case TerrainTypeID.INDOOR_TOILET: return ImageID.TERRAIN__INDOOR_TOILET;
            case TerrainTypeID.INDOOR_CLINICAL_PALLETTE: return ImageID.TERRAIN__INDOOR_EMPTY_CLINICAL_PALLETTE;
            case TerrainTypeID.INDOOR_TABLE: return ImageID.TERRAIN__INDOOR_TABLE;
            default:
                return null;
        }
    }
}
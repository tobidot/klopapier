import WorldMap from "../../../logic/map/WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import ImageManager from "../../../manager/ImageManager";
import { WorldMapVisualizer, Camera } from "../WorldMapVisualizer";
import FieldDrawer from "./FieldDrawer";
import { TerrainDrawer } from "./TerrainDrawer";
import { ObjectDrawer } from "./ObjectDrawer";

export default class WorldMapVisualizerDefault extends WorldMapVisualizer {
    private field_drawer: FieldDrawer;

    constructor(context: CanvasRenderingContext2D, image_manager: ImageManager) {
        super(context, image_manager);
        this.field_drawer = (new FieldDrawer(this.context, this.image_manager));

        this.field_drawer.add(new TerrainDrawer(this.image_manager));
        this.field_drawer.add(new ObjectDrawer(this.image_manager));
        this.field_drawer.camera = this.camera;
        context.imageSmoothingEnabled = false;
    }

    public display(world_map: WorldMap<TerrainTypeID>, delta_seconds: number) {
        this.context.save();
        this.context.rect(0, 0, this.camera.display_target_rect.width(), this.camera.display_target_rect.height());
        this.context.clip();

        this.field_drawer.get_drawer_functions().forEach((draw) => {
            world_map.map_fields_in_rect(this.camera.map_source_rect, draw);
        });

        this.context.restore();
    }
}


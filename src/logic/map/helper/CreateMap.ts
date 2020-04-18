import MapData from "../../data/MapData";
import WorldMap, { FieldGenerator } from "../WorldMap";
import { TerrainTypeID } from "../../../assets/TerrainResources";
import Terrain from "../Terrain";
import { Point } from "../../../ts_library/space/SimpleShapes";
import Field from "../Field";

export default class CreateMap {
    public map_data: MapData;
    constructor() {
        this.map_data = new MapData(5, 5, 1, 1);
    }

    public build(map_data?: MapData): WorldMap<TerrainTypeID> {
        if (map_data) this.map_data = map_data;
        const field_generator: FieldGenerator<TerrainTypeID> = this.field_generator;
        const map = new WorldMap(this.map_data.width, this.map_data.height, field_generator);
        return map;
    }

    public get_start_time_of_day() {
        return this.map_data.start_day_time;
    }

    private field_generator = (map: WorldMap<TerrainTypeID>, x: number, y: number) => {
        const field_data = this.map_data.at(x, y);
        const possible_terrain = [
            TerrainTypeID.INDOOR_SHOP,
            TerrainTypeID.OUTDOOR_GRAS,
        ];
        const terrain: Terrain = {
            type: field_data.terrain,
            variation_key: 'default',
        };
        let objects = [];
        if (field_data.object) {
            objects.push(new field_data.object(map, new Point(x, y)));
        }
        const field: Field = { location: new Point(x, y), objects, terrain };
        return field;
    };
}
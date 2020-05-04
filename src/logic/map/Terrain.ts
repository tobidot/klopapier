import { TerrainTypeID } from "../../assets/TerrainResources";

export default interface Terrain {
    type: TerrainTypeID;
    variation_key: number;
}
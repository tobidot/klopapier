import { ImageID } from "../../assets/ImageResources";
import MapData from "./MapData";

export default interface LevelData {
    map_data: MapData;
    introuction_image: ImageID;
    start_day_time: number;
}
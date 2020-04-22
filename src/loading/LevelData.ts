import MapData from "./MapData";
import { ImageID } from "../assets/ImageResources";

export default interface LevelData {
    map_data: MapData;
    introuction_image: ImageID;
    start_day_time: number;
}
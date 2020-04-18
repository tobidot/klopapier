import MapData from "../logic/data/MapData";
import { map1 } from "../assets/images/maps/map1";
import { map2 } from "../assets/images/maps/map2";
import { map3 } from "../assets/images/maps/map3";
import { map4 } from "../assets/images/maps/map4";
import { map5 } from "../assets/images/maps/map5";
import { map6 } from "../assets/images/maps/map6";
import { map7 } from "../assets/images/maps/map7";
import { map8 } from "../assets/images/maps/map8";
import { map9 } from "../assets/images/maps/map9";
import { load_mapdata_from_image_array } from "../logic/data/MapDataLoader";
import { ImageID } from "../assets/ImageResources";
import LevelData from "../logic/data/LevelData";

type RawMapData = { width: number, height: number, data: number[] };

export default class GameLevels {
    private current_level = 0;
    private levels: LevelData[] = [];

    constructor() {
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL1,
            map_data: load_mapdata_from_image_array(map1.width, map1.height, map1.data),
            start_day_time: 12,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL2,
            map_data: load_mapdata_from_image_array(map2.width, map2.height, map2.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL3,
            map_data: load_mapdata_from_image_array(map3.width, map3.height, map3.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL4,
            map_data: load_mapdata_from_image_array(map4.width, map4.height, map4.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL5,
            map_data: load_mapdata_from_image_array(map5.width, map5.height, map5.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL6,
            map_data: load_mapdata_from_image_array(map6.width, map6.height, map6.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL7,
            map_data: load_mapdata_from_image_array(map7.width, map7.height, map7.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL8,
            map_data: load_mapdata_from_image_array(map8.width, map8.height, map8.data),
            start_day_time: 6,
        });
        this.add_level({
            introuction_image: ImageID.TUTORIAL__LEVEL9,
            map_data: load_mapdata_from_image_array(map9.width, map9.height, map9.data),
            start_day_time: 6,
        });
    }

    public add_level(level_data: LevelData) {
        this.levels.push(level_data);
    }

    public current(): LevelData {
        return this.levels[this.current_level];
    }

    public next(): LevelData | false {
        this.current_level++;
        if (this.current_level >= this.levels.length) return false;
        return this.current();
    }
    public select(index: number) {
        this.current_level = index;
    }
}
import MapData, { MapFieldData } from "./MapData";
import { deflate } from "zlib";
import { TerrainTypeID } from "../../assets/TerrainResources";
import Virus from "../map/objects/Virus";
import Wall from "../map/objects/Wall";
import Nudel from "../map/objects/Nudel";
import Paperroll from "../map/objects/Klopapier";
import Spray from "../map/objects/Spray";

export function load_mapdata_from_image(image: HTMLImageElement): MapData {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to create Context');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imgdata = ctx.getImageData(0, 0, image.width, image.height);
    const imgdata_as_32bit = new Uint32Array(imgdata.data.buffer);
    let [player_x, player_y] = imgdata_as_32bit.reduce((pos: [number, number], color: number, index: number) => {
        if (color === Colors.CYAN || color === Colors.DARK_CYAN) {
            let new_pos: [number, number] = [index % image.width, Math.floor(index / image.width)];
            return new_pos;
        }
        return pos;
    }, [Math.floor(image.width / 2), Math.floor(image.height / 2)]);
    let mapdata = new MapData(image.width, image.height, player_x, player_y);
    imgdata_as_32bit.forEach((color: number, index: number) => {
        const x = index % imgdata.width;
        const y = Math.trunc(index / imgdata.width);
        mapdata.set(x, y, color_to_mapfielddata(color));
    });

    return mapdata;
}

function color_to_mapfielddata(color: number): Partial<MapFieldData> {
    switch (color) {
        case Colors.BLACK: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Wall
        };
        case Colors.DARK_GRAY: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
        };

        case Colors.GRAY: return {
            terrain: TerrainTypeID.INDOOR_CLINICAL_PALLETTE,
        };
        case Colors.WHITE: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Spray
        };



        case Colors.CYAN: return { // Player
            terrain: TerrainTypeID.OUTDOOR_GRAS,
        };
        case Colors.DARK_CYAN: return { // Player
            terrain: TerrainTypeID.INDOOR_SHOP,
        };

        case Colors.RED: return {
            terrain: TerrainTypeID.OUTDOOR_GRAS,
            object: Virus,
        };
        case Colors.DARK_RED: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Virus,
        };

        case Colors.YELLOW: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Paperroll,
        };
        case Colors.DARK_YELLOW: return {
            terrain: TerrainTypeID.INDOOR_TOILET,
        };

        case Colors.BLUE: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Nudel
        };
        case Colors.DARK_BLUE: return {
            terrain: TerrainTypeID.INDOOR_TABLE,
        };

        case Colors.DARK_MAGENTA: return {
            terrain: TerrainTypeID.INDOOR_CLINICAL_PALLETTE,
        };
        case Colors.MAGENTA: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Spray
        };

        default:
        case Colors.DARK_GREEN:
        case Colors.GREEN: return {
            terrain: TerrainTypeID.OUTDOOR_GRAS
        };
    }
}

enum Colors {
    RED = 0xFF0000FF,
    GREEN = 0xFF00FF00,
    YELLOW = 0xFF00FFFF,
    BLUE = 0xFFFF0000,
    MAGENTA = 0xFFFF00FF,
    CYAN = 0xFFFFFF00,

    BLACK = 0xFF000000,
    GRAY = 0xFFFFFFFF,
    WHITE = 0xFF888888,

    DARK_GRAY = 0xFF1F1F1F,
    DARK_RED = 0xFF00001f,
    DARK_GREEN = 0xFF001f00,
    DARK_YELLOW = 0xFF001f1f,
    DARK_BLUE = 0xFF1f0000,
    DARK_MAGENTA = 0xFF1f001f,
    DARK_CYAN = 0xFF1f1f00,
}
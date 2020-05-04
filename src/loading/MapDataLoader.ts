import MapData, { MapFieldData } from "./MapData"; import { TerrainTypeID } from "../assets/TerrainResources"; import Wall from "../logic/objects/Wall"; import Spray from "../logic/objects/Spray"; import Agent from "../logic/objects/Agent"; import Virus from "../logic/objects/Virus"; import Paperroll from "../logic/objects/Klopapier"; import Nudel from "../logic/objects/Nudel";
import ClinicalPalette from "../logic/objects/ClinicalPallette";
import Toilet from "../logic/objects/Toilet";
import Dish from "../logic/objects/Dish";

export function load_mapdata_from_image(image: HTMLImageElement): MapData {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to create Context');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imgdata = ctx.getImageData(0, 0, image.width, image.height);
    const imgdata_as_32bit = new Uint32Array(imgdata.data.buffer);
    let mapdata = new MapData(image.width, image.height);
    imgdata_as_32bit.forEach((color: number, index: number) => {
        const x = index % imgdata.width;
        const y = Math.trunc(index / imgdata.width);
        mapdata.set(x, y, color_to_mapfielddata(color));
    });

    return mapdata;
}


export function load_mapdata_from_image_array(width: number, height: number, data: number[]): MapData {
    let mapdata = new MapData(width, height);
    data.forEach((color: number, index: number) => {
        const x = index % width;
        const y = Math.trunc(index / width);
        mapdata.set(x, y, color_to_mapfielddata(color));
    });
    return mapdata;
}

export function color_to_mapfielddata(color: number): Partial<MapFieldData> {
    switch (color) {
        case Colors.BLACK: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Wall
        };
        case Colors.DARK_GRAY: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
        };

        case Colors.GRAY: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: ClinicalPalette,
        };
        case Colors.WHITE: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Spray,
        };



        case Colors.CYAN: return { // Player
            terrain: TerrainTypeID.OUTDOOR_GRAS,
            object: Agent,
        };
        case Colors.DARK_CYAN: return { // Player
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Agent,
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
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Toilet,
        };

        case Colors.BLUE: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Nudel
        };
        case Colors.DARK_BLUE: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: Dish,
        };

        case Colors.DARK_MAGENTA: return {
            terrain: TerrainTypeID.INDOOR_SHOP,
            object: ClinicalPalette,
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
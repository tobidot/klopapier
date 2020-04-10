import MapData from "./MapData";
import { TerrainTypeID } from "../../assets/TerrainResources";
import Virus from "../map/objects/Virus";
import Paperroll from "../map/objects/Klopapier";
import Spray from "../map/objects/Spray";
import Wall from "../map/objects/Wall";
import Nudel from "../map/objects/Nudel";
import Furniture1 from "../map/objects/Furniture1";
import { Direction } from "../../ts_library/space/Direction";
import { load_mapdata_from_image } from "./MapDataLoader";

const tin = TerrainTypeID.INDOOR_SHOP;
const tout = TerrainTypeID.OUTDOOR_GRAS;
const p_stock = TerrainTypeID.INDOOR_PALLETTE;
const table = TerrainTypeID.INDOOR_TABLE;
const c_stock = TerrainTypeID.INDOOR_CLINICAL_PALLETTE;
const toilet = TerrainTypeID.INDOOR_TOILET;
const v = Virus;
const p = Paperroll;
const s = Spray;
const n = Nudel;
const w = Wall;

export var data: MapData = new MapData(8, 8, 1, 1);
data.start_day_time = 10;


const dixi = data.add_snippet([
    [tin, w], [tin, w], [tin, w],
    [tin, w], [toilet,], [tin,],
    [tin, w], [tin, w], [tin, w],
], 3, 3);

const toilet_room = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [c_stock,], [toilet,], [tin, w],
    [tin, w], [tin,], [tin, p], [tin, w],
    [tin, w], [tin,], [tin, w], [tin, w],
], 4, 4);


const hospital = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
    [tin, w], [c_stock, s], [tin, s], [tin,], [tin,], [tin, s], [c_stock, s], [tin, w],
    [tin, w], [tin, p], [tin, p], [tin,], [tin,], [tin, p], [tin, p], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin, n], [tin, n], [tin,], [tin,], [tin, n], [tin, n], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
], 8, 8);


const restaurant = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, n], [table,], [tin,], [tin, n], [tin, w],
    [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin,], [tin,], [table,], [tin,], [tin,], [tin, w],
    [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin, n], [table,], [tin,], [tin, n], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 7);


const warehouse = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin,], [tin, w],
    [tin, w], [tin,], [tin, s], [tin,], [tin,], [tin, w],
    [tin, w], [tin, s], [tin, w], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [tin, p], [tin,], [tin, n], [tin, w],
    [tin, w], [tin, p], [tin,], [tin, n], [tin,], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 6);

const house = data.add_snippet([
    [tin, w], [tin,], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin,], [tin, s], [c_stock, s], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [table, n], [table, n], [tin,], [tin,],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 5);

const house2 = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, p], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin, p], [tin, w], [tin,], [tin,], [tin, w],
    [tin, w], [tin, p], [table,], [tin,], [tin,], [tin,],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 5);


const garden = data.add_snippet([
    [tout, w], [tout,], [tout, w],
    [tout,], [tout,], [tout,],
    [tout, w], [tout,], [tout, w],
], 3, 3);

const fence = data.add_snippet([
    [tout, w], [tout, w], [tout, w],
], 3, 1);

data.put(house, 0, 0, Direction.DOWN);
data.put(fence, 6, 0, Direction.DOWN);
data.put(dixi, 5, 5, Direction.LEFT);

data.set(7, 0, {
    object: Virus,
});


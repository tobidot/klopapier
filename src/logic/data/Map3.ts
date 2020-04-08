import MapData from "./MapData";
import { TerrainTypeID } from "../../assets/TerrainResources";
import Virus from "../map/objects/Virus";
import Paperroll from "../map/objects/Klopapier";
import Spray from "../map/objects/Spray";
import Wall from "../map/objects/Wall";
import Nudel from "../map/objects/Nudel";
import Furniture1 from "../map/objects/Furniture1";
import { Direction } from "../../ts_library/space/Direction";

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

export var data: MapData = new MapData(40, 40, 32, 32);
data.start_day_time = 4;


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
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin,],
    [tin, w], [tin,], [table,], [tin,], [tin,], [tin,],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin,],
    [tin, w], [tin, n], [table,], [tin,], [tin, n], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 7);


const warehouse = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin, s], [tin,], [tin,], [tin,],
    [tin, w], [tin, s], [tin, w], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [tin, p], [tin,], [tin, n], [tin, w],
    [tin, w], [tin, p], [tin,], [tin, n], [tin,], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 6);

const house = data.add_snippet([
    [tin, w], [tin,], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin, s], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [table, n], [tin, n], [tin,], [tin,],
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

const virusgroup = data.add_snippet([
    [tout, v], [tout, v],
    [tout, v], [tout, v],
], 2, 2);


data.put(virusgroup, 38, 38);
data.put(virusgroup, 2, 2);
data.put(virusgroup, 2, 38);
data.put(virusgroup, 38, 2);
data.put(virusgroup, 16, 16);



data.put(house, 3, 8, Direction.LEFT);
data.put(house, 14, 34, Direction.RIGHT);
data.put(house2, 31, 31, Direction.DOWN);
data.put(fence, 6, 0, Direction.DOWN);
data.put(dixi, 20, 30, Direction.DOWN);
data.put(dixi, 25, 30, Direction.DOWN);
data.put(dixi, 28, 30, Direction.DOWN);
data.put(dixi, 35, 30, Direction.DOWN);
data.put(dixi, 35, 10, Direction.DOWN);
data.put(dixi, 30, 8, Direction.UP);
data.put(warehouse, 10, 18, Direction.LEFT);
data.put(warehouse, 30, 0, Direction.LEFT);
data.put(warehouse, 5, 20, Direction.LEFT);
data.put(warehouse, 30, 24, Direction.LEFT);
data.put(hospital, 5, 5, Direction.LEFT);
data.put(restaurant, 0, 20, Direction.RIGHT);


data.put(garden, 25, 25, Direction.RIGHT);
data.put(garden, 21, 25, Direction.RIGHT);
data.put(garden, 19, 24, Direction.RIGHT);

data.put(garden, 25, 15, Direction.RIGHT);
data.put(garden, 21, 15, Direction.RIGHT);
data.put(garden, 19, 14, Direction.RIGHT);




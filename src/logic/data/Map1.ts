import MapData from "./MapData";
import { TerrainTypeID } from "../../assets/TerrainResources";
import Virus from "../map/objects/Virus";
import Paperroll from "../map/objects/Klopapier";
import Spray from "../map/objects/Spray";
import Wall from "../map/objects/Wall";
import Nudel from "../map/objects/Nudel";
import Furniture1 from "../map/objects/Furniture1";

const tin = TerrainTypeID.INDOOR_SHOP;
const tout = TerrainTypeID.OUTDOOR_GRAS;
const v = Virus;
const p = Paperroll;
const s = Spray;
const n = Nudel;
const w = Wall;
const f1 = Furniture1;

export var data: MapData = new MapData(16, 16);


const dixi = data.add_snippet([
    [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, p], [tin, w],
    [tin, w], [tin], [tin, w],
], 3, 3);

const toilet = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, s], [tin, f1], [tin, w],
    [tin, w], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [tin, w], [tin, w],
], 4, 4);

const hospital = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, s], [tin, f1], [tin,], [tin,], [tin, f1], [tin, s], [tin, w],
    [tin, w], [tin, p], [tin,], [tin,], [tin,], [tin,], [tin, p], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, s], [tin, f1], [tin,], [tin,], [tin, f1], [tin, s], [tin, w],
    [tin, w], [tin, p], [tin,], [tin,], [tin,], [tin,], [tin, p], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin,], [tin,], [tin, w], [tin, w], [tin, w],
], 8, 8);


const restaurant = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, n], [tin, f1], [tin, n], [tin,], [tin, w],
    [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin,], [tin, n], [tin, f1], [tin,], [tin,], [tin, w],
    [tin,], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin, n], [tin, f1], [tin, n], [tin,], [tin, w],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 7);


const house2 = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [tin, f1], [tin, n], [tin,], [tin, w],
    [tin, w], [tin, p], [tin, f1], [tin, n], [tin,], [tin,],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 5);


data.put(dixi, 0, 0);
data.put(dixi, 5, 0);
data.put(restaurant, 3, 6);
data.put(dixi, 8, 6);
data.put(dixi, 7, 12);
data.put(toilet, 12, 10);
data.put(toilet, 7, 10);

data.set(5, 5, {
    object: Virus,
});

data.set(10, 5, {
    object: Virus,
});

data.set(5, 10, {
    object: Virus,
});

data.set(15, 15, {
    object: Virus,
});


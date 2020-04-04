import MapData from "./MapData";
import { TerrainTypeID } from "../../assets/TerrainResources";
import Virus from "../map/objects/Virus";
import Paperroll from "../map/objects/Klopapier";
import Spray from "../map/objects/Spray";
import Wall from "../map/objects/Wall";
import Nudel from "../map/objects/Nudel";

export var data: MapData = new MapData(20, 20);
const tin = TerrainTypeID.INDOOR_SHOP;
const tout = TerrainTypeID.OUTDOOR_GRAS;
const v = Virus;
const p = Paperroll;
const s = Spray;
const n = Nudel;
const w = Wall;


const house = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin, n], [tin, n], [tin, w],
    [tin, w], [tin], [tin], [tin],
    [tin, w], [tin, w], [tin, w], [tin, w],
], 4, 4);

const house2 = data.add_snippet([
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
    [tin, w], [tin,], [tin,], [tin,], [tin,], [tin, w],
    [tin, w], [tin,], [tin, w], [tin, n], [tin,], [tin, w],
    [tin, w], [tin, p], [tin, w], [tin, n], [tin,], [tin,],
    [tin, w], [tin, w], [tin, w], [tin, w], [tin, w], [tin, w],
], 6, 5);

data.put(house, 0, 0);

data.put(house2, 0, 8);

for (let i = 0; i < 5; ++i) {

    data.set(5 + i, 5, {
        terrain: tout,
        object: Virus,
    });
}

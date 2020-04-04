import { TerrainTypeID } from "../../assets/TerrainResources";
import Spray from "../map/objects/Spray";
import Nudel from "../map/objects/Nudel";
import Paperroll from "../map/objects/Klopapier";
import Virus from "../map/objects/Virus";
import { type } from "os";
import { timingSafeEqual } from "crypto";
import Wall from "../map/objects/Wall";


type AllowedObjectType = typeof Spray | typeof Nudel | typeof Paperroll | typeof Virus | typeof Wall;
export interface MapFieldData {
    terrain: TerrainTypeID,
    object?: AllowedObjectType,
}

interface MapDataSnippet {
    data: MapFieldData[],
    width: number,
    height: number
}

export default class MapData {
    private width: number;
    private height: number;
    private snippets: MapDataSnippet[] = [];

    public data: {
        [col: number]: {
            [row: number]: MapFieldData
        },
    }
    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.data = [...new Array(width)].map(() => {
            return [...new Array(height)].map((): MapFieldData => {
                return {
                    terrain: TerrainTypeID.OUTDOOR_GRAS
                };
            });
        });
    }
    public set(x: number, y: number, data: MapFieldData) {
        this.data[Math.abs(x) % this.width][Math.abs(y) % this.height] = data;
    }

    public at(x: number, y: number): MapFieldData {
        return this.data[Math.abs(x) % this.width][Math.abs(y) % this.height];
    }

    add_snippet(snippet: MapFieldData[], width: number, height: number): number;
    add_snippet(snippet: [TerrainTypeID, AllowedObjectType?][], width: number, height: number): number;
    public add_snippet(snippet: (MapFieldData | [TerrainTypeID, AllowedObjectType?])[], width: number, height: number): number {
        if (snippet instanceof Array === false) return -1;
        const data = (snippet).map((field: MapFieldData | [TerrainTypeID, AllowedObjectType?]): MapFieldData => {
            let result: MapFieldData = {
                terrain: TerrainTypeID.OUTDOOR_GRAS,
            };
            if (field instanceof Array) {
                result = {
                    terrain: field[0],
                    object: field[1],
                };
            } else {
                result = field;
            }
            return result;
        });
        this.snippets.push({
            data,
            width,
            height
        });
        return this.snippets.length - 1;
    }
    public put(snippet_id: number, x: number, y: number) {
        const snippet = this.snippets[snippet_id];
        for (let xi = 0; xi < snippet.width; xi++) {
            for (let yi = 0; yi < snippet.height; yi++) {
                this.set(x + xi, y + yi, snippet.data[xi + yi * snippet.width]);
            }
        }
    }
};
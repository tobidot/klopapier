import { TerrainTypeID } from "../../assets/TerrainResources";
import Spray from "../map/objects/Spray";
import Nudel from "../map/objects/Nudel";
import Paperroll from "../map/objects/Klopapier";
import Virus from "../map/objects/Virus";
import { type } from "os";
import { timingSafeEqual } from "crypto";
import Wall from "../map/objects/Wall";
import { Direction } from "../../ts_library/space/Direction";


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
    public readonly width: number;
    public readonly height: number;
    public readonly player_x: number;
    public readonly player_y: number;
    public start_day_time: number = 6;
    private snippets: MapDataSnippet[] = [];

    public data: {
        [col: number]: {
            [row: number]: MapFieldData
        },
    }
    public constructor(width: number, height: number, x: number, y: number) {
        this.player_x = x;
        this.player_y = y;
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
    public set(x: number, y: number, data: Partial<MapFieldData>) {
        Object.assign(this.data[Math.abs(x) % this.width][Math.abs(y) % this.height], data);
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
    public put(snippet_id: number, x: number, y: number, rotate: Direction = Direction.RIGHT) {
        const snippet = this.snippets[snippet_id];
        for (let xi = 0; xi < snippet.width; xi++) {
            for (let yi = 0; yi < snippet.height; yi++) {
                const [rx, ry] = this.rotate(xi, yi, snippet.width, snippet.height, rotate);
                this.set(x + rx, y + ry, snippet.data[xi + yi * snippet.width]);
            }
        }
    }
    private rotate(x: number, y: number, w: number, h: number, rotate: Direction): [number, number] {
        switch (rotate) {
            case Direction.LEFT: return [w - x - 1, y];
            case Direction.UP: return [y, w - x - 1];
            case Direction.RIGHT: return [x, y];
            case Direction.DOWN: return [h - y - 1, x];
        }
    }

};
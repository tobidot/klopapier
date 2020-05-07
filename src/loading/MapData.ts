import Agent from "../logic/objects/Agent"; import Spray from "../logic/objects/Spray"; import Nudel from "../logic/objects/Nudel"; import Paperroll from "../logic/objects/Paperroll"; import Virus from "../logic/objects/Virus"; import Wall from "../logic/objects/Wall"; import { TerrainTypeID } from "../assets/TerrainResources"; import { Direction } from "../ts_library/space/Direction";
import ClinicalPalette from "../logic/objects/ClinicalPallette";
import Dish from "../logic/objects/Dish";
import Toilet from "../logic/objects/Toilet";


type AllowedObjectType = typeof Dish | typeof ClinicalPalette | typeof Toilet | typeof Agent | typeof Spray | typeof Nudel | typeof Paperroll | typeof Virus | typeof Wall;
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
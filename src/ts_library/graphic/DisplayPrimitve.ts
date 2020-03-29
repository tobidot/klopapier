import { Coordinate, Point2 } from "../space/Coordinate";

export enum DisplayPrimitiveType {
    CUSTOM,
    BLOCK,
    BLOB,
    POLYLINE
}

export interface DisplayPrimitive<COORD extends Coordinate> {
    type: DisplayPrimitiveType;
}

export interface DisplayPrimitiveBlock<COORD extends Coordinate> {
    type: DisplayPrimitiveType.BLOCK;
    position: COORD;
    size: COORD;
}

export interface DisplayPrimitiveBlob<COORD extends Coordinate> {
    type: DisplayPrimitiveType.BLOB;
    position: COORD;
    size: number;
}

export interface DisplayPrimitivePolyline<COORD extends Coordinate> {
    type: DisplayPrimitiveType.POLYLINE;
    point: Array<COORD>;
    is_closed: boolean;
}
export type Coordinate = Point2 | Point3;

export interface Point1 {
    x: number
}

export interface Point2 extends Point1 {
    y: number
}

export interface Point3 extends Point2 {
    z: number
}

export type Size1 = Point1;
export type Size2 = Point2;
export type Size3 = Point3;

export function is_point_within_size_ex(point: Point1, size: Size1): boolean;
export function is_point_within_size_ex(point: Point2, size: Size2): boolean;
export function is_point_within_size_ex(point: Point3, size: Size3): boolean;
export function is_point_within_size_ex(point: Point1 | Point2 | Point3, size: Size1 | Size2 | Size3): boolean {
    if ('z' in point && 'z' in size && point.z < 0 && point.z >= size.z) return false;
    if ('y' in point && 'y' in size && point.y < 0 && point.y >= size.y) return false;
    if ('x' in point && 'x' in size && point.x < 0 && point.x >= size.x) return false;
    return true;
}

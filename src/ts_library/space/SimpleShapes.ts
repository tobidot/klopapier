export interface IPoint {
    x: number;
    y: number;
};

export type RectSize = Point;

export class Point implements IPoint {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(other: IPoint): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    public sub(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }

    public mul(value: IPoint): Point;
    public mul(value: number): Point;
    public mul(value: IPoint | number) {
        if (typeof value === "number") {
            return new Point(this.x * value, this.y * value);
        }
        return new Point(this.x * value.x, this.y * value.y);
    }

    public equals(other: Point, epsilon?: number): boolean;
    public equals(by_x: number, by_y: number, epsilon?: number): boolean;
    public equals(by_x: number | Point, by_y?: number, epsilon?: number): boolean {
        if (by_x instanceof Point) {
            epsilon = by_y || 0;
            by_y = by_x.y;
            by_x = by_x.x;
        } else {
            if (by_y === undefined) throw new Error('Invalid Parameters to call');
            epsilon = epsilon || 0;
        }
        return Math.abs(this.x - by_x) <= epsilon && Math.abs(this.y - by_y) <= epsilon;
    }

    public move_by(other: Point, _?: undefined): Point;
    public move_by(by_x: number, by_y: number): Point;
    public move_by(by_x: number | Point, by_y: number | undefined): Point {
        if (by_x instanceof Point) {
            by_y = by_x.y;
            by_x = by_x.x;
        }
        if (by_y === undefined) throw new Error('Invalid Parameters to call');
        this.x += by_x;
        this.y += by_y;
        return this;
    }

    public copy(): Point {
        return new Point(this.x, this.y);
    }

    public map(fn: (value: number) => number) {
        return new Point(fn(this.x), fn(this.y));
    }

    public static create_random_direction(): Point {
        let x = Math.trunc(Math.random() * 3) - 1;
        let y = Math.trunc(Math.random() * 3) - 1;
        return new Point(x, y);
    }

    public static create_random_direction_non_diagonal(): Point {
        switch (Math.trunc(Math.random() * 4)) {
            case 0: return new Point(1, 0);
            case 1: return new Point(-1, 0);
            case 2: return new Point(0, -1);
            case 3: return new Point(0, 1);
            default: throw new Error("???");
        }
    }
}


export interface IRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export class Rect implements IRect {
    public left: number;
    public top: number;
    public right: number;
    public bottom: number;

    private constructor(
        left: number,
        top: number,
        right: number,
        bottom: number,
    ) {
        this.left = Math.min(left, right);
        this.top = Math.min(top, bottom);
        this.right = Math.max(left, right);
        this.bottom = Math.max(top, bottom);;
    }

    public left_top(): Point { return new Point(this.left, this.top); }
    public right_top(): Point { return new Point(this.right, this.top); }
    public left_bottom(): Point { return new Point(this.left, this.bottom); }
    public right_bottom(): Point { return new Point(this.right, this.bottom); }

    public width(): number {
        return this.right - this.left;
    }

    public height(): number {
        return this.bottom - this.top;
    }

    public center(): Point {
        return new Point((this.left + this.right) / 2, (this.top + this.bottom) / 2);
    }

    public get_random_point() {
        return new Point(this.left + Math.random() * this.width(), this.top + Math.random() * this.height());
    }

    public move_by(x: number, y: number): Rect {
        this.left += x;
        this.right += x;
        this.top += y;
        this.bottom += y;
        return this;
    }

    public for_each_point_in_rect(callback: (position: Point) => void) {
        for (let x = this.left; x <= this.right; ++x) {
            for (let y = this.top; y <= this.bottom; ++y) {
                callback(new Point(x, y));
            }
        }
    }

    public map_points_in_rect<R>(callback: (position: Point) => R): Array<R> {
        let result = new Array<R>(this.width() * this.height());
        let i = 0;
        for (let x = this.left; x <= this.right; ++x) {
            for (let y = this.top; y <= this.bottom; ++y) {
                result[i] = callback(new Point(x, y));
                ++i;
            }
        }
        return result;
    }

    public set_center(center: Point): Rect {
        const old_center = this.center();
        const moved_by = center.sub(old_center);
        return this.move_by(moved_by.x, moved_by.y);
    }

    public get_inner_rect(border: number): Rect {
        return new Rect(
            this.left + border,
            this.top + border,
            this.right - border,
            this.bottom - border
        );
    }

    public is_containing(point: Point) {
        return (this.left <= point.x &&
            this.right >= point.x &&
            this.top <= point.y &&
            this.bottom >= point.y);
    }

    public is_equal(other: Rect) {
        return this.left === other.left &&
            this.right === other.right &&
            this.top === other.top &&
            this.bottom === other.bottom;
    }

    public is_intersecting(other: Rect): boolean {
        return this.left <= other.right &&
            this.right >= other.left &&
            this.top <= other.bottom &&
            this.bottom >= other.top;
    }

    public get_intersection(other: Rect): Rect | null {
        if (!this.is_intersecting(other)) return null;
        return Rect.from_boundries(
            Math.max(this.left, other.left),
            Math.max(this.top, other.top),
            Math.min(this.right, other.right),
            Math.min(this.bottom, other.bottom)
        );
    }

    public static from_boundries(
        left: number,
        top: number,
        right: number,
        bottom: number,
    ): Rect {
        return new Rect(left, top, right, bottom);
    }

    public static from_point_with_size(
        center: Point,
        width: number,
        height: number,
    ): Rect {
        return new Rect(center.x - width / 2, center.y - height / 2, center.x + width / 2, center.y + height / 2);
    }
}
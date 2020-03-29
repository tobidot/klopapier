import { Coordinate, Point2 } from "../space/Coordinate";
import { Display4ChannelAtom } from "../graphic/DisplayAtomData";

export default abstract class Shader<TEXT_COORD extends Coordinate, DISPLAY_ATOM, DATA extends {} | void> {
    protected data: DATA;
    public constructor(data: DATA) {
        this.data = data;
    }
    public set_data(data: Partial<DATA>): void {
        Object.assign(this.data, data);
    }
    public abstract apply(coord: Point2, texture_reference: TEXT_COORD): DISPLAY_ATOM;
}
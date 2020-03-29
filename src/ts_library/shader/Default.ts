import Shader from "./Shader";
import { Coordinate, Point2 } from "../space/Coordinate";
import { Display4ChannelAtom, atom } from "../graphic/DisplayAtomData";

export interface DefaultShaderData<DISPLAY_ATOM> {
    atom: DISPLAY_ATOM;
}

export class Default<COORD extends Coordinate, DISPLAY_ATOM> extends Shader<COORD, DISPLAY_ATOM, DefaultShaderData<DISPLAY_ATOM>>{
    public apply(coord: Point2, texture_reference: COORD): DISPLAY_ATOM {
        return this.data.atom;
    }
}
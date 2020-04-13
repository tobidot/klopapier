import { Point } from "../../../ts_library/space/SimpleShapes";
import Field from "../../../logic/map/Field";
import { VisualFieldData } from "./FieldDrawer";


export type FieldDrawerPartDraw = (image: HTMLImageElement, offset?: Point) => void;

export abstract class FieldPartDrawer {
    public abstract draw(draw: FieldDrawerPartDraw, field: Field, visual_data: VisualFieldData): void;
}

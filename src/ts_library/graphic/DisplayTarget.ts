import { Display4ChannelAtom, atom } from "./DisplayAtomData";
import { Coordinate, Size2, Point2, is_point_within_size_ex } from "../space/Coordinate";
import { DisplayPrimitive } from "./DisplayPrimitve";
import Shader from "../shader/Shader";

export interface DisplayTargetErrorFlags {
    access_pixel_from_beyond?: true;
};

export default abstract class DisplayTarget<COORD extends Coordinate, ATOM> {
    public readonly display_size: Size2;
    protected display_data: Array<ATOM>;
    protected active_shader_id: number;
    private shaders: Array<Shader<COORD, ATOM, any>>;
    private error_flags: DisplayTargetErrorFlags;

    public constructor(display_size: Size2) {
        this.active_shader_id = 0;
        this.display_size = display_size;
        this.shaders = [];
        this.display_data = new Array(display_size.x * display_size.y);
        this.clear();
        this.error_flags = {};
    }
    public add_shader<SHADER_DATA extends {}>(shader: Shader<COORD, ATOM, SHADER_DATA>): number {
        return this.shaders.push(shader);
    }
    public get_shader(id: number): Shader<COORD, ATOM, any> {
        if (!(id in this.shaders)) throw new Error('Invalid shader ID');
        return this.shaders[id];
    }
    public set_active_shader(id: number): void {
        if (!(id in this.shaders)) throw new Error('Invalid shader ID');
        this.active_shader_id = id;
    }

    public set_atom(pos: Point2, data: ATOM): void {
        if (is_point_within_size_ex(pos, this.display_size)) {
            this.display_data[pos.x + pos.y * this.display_size.x] = data;
        }
    }
    public read_error_flags(): DisplayTargetErrorFlags {
        const buffer = this.error_flags;
        this.error_flags = {};
        return buffer;
    }
    public abstract clear(): void;
    public abstract draw(primitive: DisplayPrimitive<COORD>, custom_value: number): void;
    public abstract fill(primitive: DisplayPrimitive<COORD>, custom_value: number): void;
}
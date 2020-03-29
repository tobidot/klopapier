import Field from "./Field";
import Terrain from "./Terrain";
import { Rect, Point } from "../../ts_library/space/SimpleShapes";
import { TerrainTypeID } from "../../assets/TerrainResources";
import MapObject from "./objects/abstract/MapObject";
import { callbackify } from "util";
import { ListenerSocket } from "../../ts_library/ui/Listener";
import { ObjectDestroyedEvent, ObjectAttacksEvent, ObjectTouchedEvent, ObjectDamagedEvent, ObjectTouchesEvent } from "./Events";

export type FieldGenerator = (x: number, y: number) => Field;
// export type TerrainTypeMap = Map<TerrainTypeID, TerrainType>;
export type FieldCallback = (field: Field) => Field;

export default class WorldMap<TerrainTypeID> {
    public readonly width: number;
    public readonly height: number;
    public readonly events: WorldEventDelegator;
    private fields: Array<Field> = [];
    private field_generator: FieldGenerator;

    private constructor(width: number, height: number, field_generator: FieldGenerator) {
        this.width = width;
        this.height = height;
        this.field_generator = field_generator;
        this.fields = this.construct_fields();
        this.events = new WorldEventDelegator();
    }

    private construct_fields() {
        return [...new Array<Field>(this.width * this.height)].map((_, i) => {
            return this.field_generator(i % this.width, Math.trunc(i / this.width));
        });
    }

    public at(pos: Point): Field | null {
        if (!this.get_map_boundries().is_containing(pos)) return null;
        const id = pos.x + pos.y * this.width;
        return this.fields[id];
    }

    public get_map_boundries(): Rect {
        return Rect.from_boundries(0, 0, this.width - 1, this.height - 1);
    }

    public add_object(object: MapObject) {
        this.update_field_at_point(object.get_position(), { object });
        object.on_before_position_change.add((is_allowed: boolean, event: { old: Field, new: Field }): boolean => {
            const target_field = event.new;
            if (!target_field) return false;
            const object = target_field.object;
            if (object !== null) {
                object.touched_by(object);
                if (!object.is_destroyed() && object.get_position().equals(new Point(event.new.x, event.new.y))) return false;
            }
            return is_allowed;
        });
        object.on_destroy.add(() => {
            this.update_field_at_point(object.get_position(), { object: null });
        });
        this.events.connect(object);
    }

    public update_field_at_point(pos: Point, field: Partial<Field>) {
        if (this.get_map_boundries().is_containing(pos)) {
            const id = pos.x + pos.y * this.width;
            this.fields[id] = Object.assign({}, this.fields[id], field);
        }
    }

    public map_fields_in_rect(rect: Rect, callback: FieldCallback) {
        const safe_rect = this.get_map_boundries().get_intersection(rect);
        if (!safe_rect) return null;
        const fields = safe_rect.map_points_in_rect(pos => this.fields[pos.x + pos.y * this.width]);
        fields.map(callback).forEach((field: Field) => {
            const id = field.x + field.y * this.width;
            this.fields[id] = field;
        });
    }

    public static factory() {
        return (width: number, height: number) =>
            (field_generator: FieldGenerator) => {
                return new WorldMap(width, height, field_generator);
            };
    }
}

class WorldEventDelegator {
    public readonly on_destroy: ListenerSocket<ObjectDestroyedEvent> = new ListenerSocket();
    public readonly on_touched: ListenerSocket<ObjectTouchedEvent> = new ListenerSocket();
    public readonly on_touches: ListenerSocket<ObjectTouchesEvent> = new ListenerSocket();
    public readonly on_damaged: ListenerSocket<ObjectDamagedEvent> = new ListenerSocket();
    public readonly on_attack: ListenerSocket<ObjectAttacksEvent> = new ListenerSocket();

    public connect(object: MapObject) {
        object.on_destroy.add((event: ObjectDestroyedEvent) => this.on_destroy.trigger_event(event));
        object.on_touched_by.add((event: ObjectTouchedEvent) => this.on_touched.trigger_event(event));
        object.on_damaged_by.add((event: ObjectDamagedEvent) => this.on_damaged.trigger_event(event));
        object.on_attack.add((event: ObjectAttacksEvent) => this.on_attack.trigger_event(event));
    }
}
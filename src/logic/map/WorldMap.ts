import Field from "./Field";
import Terrain from "./Terrain";
import { Rect, Point } from "../../ts_library/space/SimpleShapes";
import { TerrainTypeID } from "../../assets/TerrainResources";
import MapObject from "./objects/abstract/MapObject";
import { callbackify } from "util";
import { ListenerSocket } from "../../ts_library/ui/Listener";
import { ObjectDestroyedEvent, ObjectAttacksEvent, ObjectTouchedEvent, ObjectDamagedEvent, ObjectTouchesEvent } from "./Events";

export type FieldGenerator<TerrainTypeID> = (map: WorldMap<TerrainTypeID>, x: number, y: number) => Field;
// export type TerrainTypeMap = Map<TerrainTypeID, TerrainType>;
export type FieldCallback = (field: Field) => Field;

export default class WorldMap<TerrainTypeID> {
    public readonly width: number;
    public readonly height: number;
    public readonly events: WorldEventDelegator;
    private fields: Array<Field> = [];
    private field_generator: FieldGenerator<TerrainTypeID>;
    public readonly on_effect: ListenerSocket<Field> = new ListenerSocket();

    private constructor(width: number, height: number, field_generator: FieldGenerator<TerrainTypeID>) {
        this.width = width;
        this.height = height;
        this.events = new WorldEventDelegator(this);
        this.field_generator = field_generator;
        this.fields = this.construct_fields();
    }

    private construct_fields() {
        return [...new Array<Field>(this.width * this.height)].map((_, i) => {
            const field = this.field_generator(this, i % this.width, Math.trunc(i / this.width));
            if (field.object) this.add_object(field.object);
            return field;
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
            const target_object = target_field.object;
            if (target_object !== null) {
                target_object.touched_by(object);
                return false;
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

    public effect(pos: Point) {
        const field = this.at(pos);
        if (field) {
            this.on_effect.trigger_event(field);
        }
    }

    public static factory<TerrainTypeID>() {
        return (width: number, height: number) =>
            (field_generator: FieldGenerator<TerrainTypeID>) => {
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
    public readonly on_effect: ListenerSocket<Field> = new ListenerSocket();

    public constructor(map: WorldMap<TerrainTypeID>) {
        map.on_effect.add((event) => this.on_effect.trigger_event(event));
    }

    public connect(object: MapObject) {
        object.on_destroy.add((event: ObjectDestroyedEvent) => this.on_destroy.trigger_event(event));
        object.on_touched_by.add((event: ObjectTouchedEvent) => this.on_touched.trigger_event(event));
        object.on_damaged_by.add((event: ObjectDamagedEvent) => this.on_damaged.trigger_event(event));
        object.on_attack.add((event: ObjectAttacksEvent) => this.on_attack.trigger_event(event));
    }
}
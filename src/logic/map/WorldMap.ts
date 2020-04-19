import Field from "./Field";
import Terrain from "./Terrain";
import { Rect, Point } from "../../ts_library/space/SimpleShapes";
import { TerrainTypeID } from "../../assets/TerrainResources";
import MapObject from "./objects/abstract/MapObject";
import { callbackify } from "util";
import { ListenerSocket } from "../../ts_library/ui/Listener";
import { ObjectDestroyedEvent, ObjectAttacksEvent, ObjectTouchedEvent, ObjectDamagedEvent, ObjectTouchesEvent } from "./Events";
import { Task } from "../flow/Task";
import { GameState } from "../../main/GameState";
import { PositionComponent } from "./objects/components/PositionComponent";

export type FieldGenerator<TerrainTypeID> = (map: WorldMap<TerrainTypeID>, x: number, y: number) => Field;
// export type TerrainTypeMap = Map<TerrainTypeID, TerrainType>;
export type FieldCallback = (field: Field) => Field;

export default class WorldMap<TerrainTypeID> {
    public readonly width: number;
    public readonly height: number;
    public readonly events: WorldEventDelegator;

    private fields: Array<Field> = [];
    private field_generator: FieldGenerator<TerrainTypeID>;

    public constructor(width: number, height: number, field_generator: FieldGenerator<TerrainTypeID>) {
        this.width = width;
        this.height = height;
        this.events = new WorldEventDelegator(this);
        this.field_generator = field_generator;
        this.fields = this.construct_fields();
    }

    private construct_fields() {
        return [...new Array<Field>(this.width * this.height)].map((_, i) => {
            const field = this.field_generator(this, i % this.width, Math.trunc(i / this.width));
            return field;
        });
    }

    public get_map_boundries(): Rect {
        return Rect.from_boundries(0, 0, this.width - 1, this.height - 1);
    }

    public at(pos: Point): Field | null {
        if (!this.get_map_boundries().is_containing(pos)) return null;
        const id = pos.x + pos.y * this.width;
        return this.fields[id];
    }

    public update(delta_seconds: number): Task[] {
        return this.map_fields_in_rect(this.get_map_boundries(), (field) => {
            return field.objects.flatMap((object): Task[] => {
                // Own System?
                const position = object.get(PositionComponent);
                if (position) position.position = field.location.copy();
                return object.update(delta_seconds);
            });
        }).flatMap((tasks: Task[]) => tasks);
    }


    public update_field_at_point(pos: Point, field: Partial<Field>) {
        if (this.get_map_boundries().is_containing(pos)) {
            const id = pos.x + pos.y * this.width;
            this.fields[id] = Object.assign({}, this.fields[id], field);
        }
    }

    public map_fields_in_rect<R>(rect: Rect, callback: (field: Field) => R): Array<R> {
        const safe_rect = this.get_map_boundries().get_intersection(rect);
        if (!safe_rect) return [];
        const fields = safe_rect.map_points_in_rect(pos => this.fields[pos.x + pos.y * this.width]);
        return fields.map(callback);
    }

    public get_fields_in_rect(rect: Rect): ReadonlyArray<Field> {
        const safe_rect = this.get_map_boundries().get_intersection(rect);
        if (!safe_rect) return [];
        return safe_rect.map_points_in_rect(pos => this.fields[pos.x + pos.y * this.width]);
    }


}

class WorldEventDelegator {
    // public readonly on_destroy: ListenerSocket<ObjectDestroyedEvent> = new ListenerSocket();
    // public readonly on_touched: ListenerSocket<ObjectTouchedEvent> = new ListenerSocket();
    // public readonly on_touches: ListenerSocket<ObjectTouchesEvent> = new ListenerSocket();
    // public readonly on_damaged: ListenerSocket<ObjectDamagedEvent> = new ListenerSocket();
    // public readonly on_attack: ListenerSocket<ObjectAttacksEvent> = new ListenerSocket();
    // public readonly on_effect: ListenerSocket<Field> = new ListenerSocket();

    public constructor(map: WorldMap<TerrainTypeID>) {
        // map.on_effect.add((event) => this.on_effect.trigger_event(event));
    }

    public connect(object: MapObject) {
        // object.on_destroy.add((event: ObjectDestroyedEvent) => this.on_destroy.trigger_event(event));
        // object.on_touched_by.add((event: ObjectTouchedEvent) => this.on_touched.trigger_event(event));
        // object.on_damaged_by.add((event: ObjectDamagedEvent) => this.on_damaged.trigger_event(event));
        // object.on_attack.add((event: ObjectAttacksEvent) => this.on_attack.trigger_event(event));
    }
}
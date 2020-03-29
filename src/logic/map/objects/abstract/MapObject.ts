import { MapObjectTypeID } from "../../../../assets/MapObjectRsources";
import { ValueChangeListenerSocket } from "../../../../ts_library/ui/Listener";
import { ValueChangeFilterSocket } from "../../../../ts_library/ui/Filter";
import { DamageType } from "../../../fight/DamageType";
import { ListenerSocket } from "../../../../ts_library/ui/Listener";
import DamageEvent from "../../../fight/DamageDescription";
import DamageDescription from "../../../fight/DamageDescription";
import { ObjectTouchesEvent, ObjectDamagedEvent, ObjectDestroyedEvent, ObjectTouchedEvent, ObjectAttacksEvent } from "../../Events";
import Field from "../../Field";
import WorldMap from "../../WorldMap";
import { TerrainTypeID } from "../../../../assets/TerrainResources";
import { Point } from "../../../../ts_library/space/SimpleShapes";
import ComponentContainer from "../components/ComponentContainer";
import MapObjectComponent from "../components/MapObjectComponent";

export default abstract class MapObject {
    public readonly type: MapObjectTypeID;
    public readonly components: ComponentContainer<MapObjectComponent>;
    public readonly on_position_change: ValueChangeListenerSocket<Field>;
    public readonly on_before_position_change: ValueChangeFilterSocket<Field>;
    public readonly on_touched_by: ListenerSocket<ObjectTouchedEvent>;
    public readonly on_damaged_by: ListenerSocket<ObjectDamagedEvent>;
    public readonly on_attack: ListenerSocket<ObjectAttacksEvent>;
    public readonly on_destroy: ListenerSocket<ObjectDestroyedEvent>;
    private position: Point;
    private _is_destroyed: boolean;

    constructor(type: MapObjectTypeID, position: Point) {
        this.type = type;
        this.components = new ComponentContainer();
        this.on_destroy = new ListenerSocket<ObjectDestroyedEvent>();
        this.on_attack = new ListenerSocket<ObjectAttacksEvent>();
        this.on_touched_by = new ListenerSocket<ObjectTouchedEvent>();
        this.on_damaged_by = new ListenerSocket<ObjectDamagedEvent>();
        this.on_position_change = new ValueChangeListenerSocket<Field>();
        this.on_before_position_change = new ValueChangeFilterSocket<Field>(true);
        this.position = position;
        this._is_destroyed = false;
    }

    public get_position(): Point {
        return this.position;
    }

    public move_to(map: WorldMap<TerrainTypeID>, target: Point): boolean {
        const old_field = map.at(this.position);
        const new_field = map.at(target);
        if (old_field === null || new_field === null) return false;
        const event = {
            old: old_field,
            new: new_field
        };
        const is_allowed = this.on_before_position_change.trigger_event(event);
        if (!is_allowed) return false;
        this.on_position_change.trigger_event(event);
        map.update_field_at_point(this.position, { object: null });
        map.update_field_at_point(target, { object: this });
        this.position = target;
        return true;
    }

    public destroy(): void {
        this._is_destroyed = true;
        this.on_destroy.trigger_event({
            destroyed: this
        });
    }

    public attack(field: Field, attack_type: DamageType): this {
        this.on_attack.trigger_event({
            attacker: this,
            target: field,
            attack_type
        });
        return this;
    }

    public touched_by(other: MapObject): this {
        this.on_touched_by.trigger_event({
            actor: this,
            target: other,
        });
        return this;
    };

    public damage(damage: DamageDescription): this {
        this.on_damaged_by.trigger_event({
            victim: this,
            damage
        });
        return this;
    };

    public is_destroyed(): boolean {
        return this._is_destroyed;
    }
}
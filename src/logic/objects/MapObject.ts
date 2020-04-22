import ComponentContainer from "../components/ComponentContainer"; import MapObjectComponent from "../components/MapObjectComponent"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import { GameState } from "../../main/GameState"; import { Task } from "../tasks/Task";


export type ObjectID = number;

export default abstract class MapObject extends ComponentContainer<MapObjectComponent>{
    public static next_instance_ID: ObjectID = 0;
    public readonly instance_ID: ObjectID = MapObject.next_instance_ID++;
    public readonly type: MapObjectTypeID;
    // public readonly on_position_change: ValueChangeListenerSocket<Field>;
    // public readonly on_before_position_change: ValueChangeFilterSocket<Field>;
    // public readonly on_touched_by: ListenerSocket<ObjectTouchedEvent>;
    // public readonly on_damaged_by: ListenerSocket<ObjectDamagedEvent>;
    // public readonly on_attack: ListenerSocket<ObjectAttacksEvent>;
    // public readonly on_destroy: ListenerSocket<ObjectDestroyedEvent>;
    // private position: Point;
    private _is_destroyed: boolean;

    constructor(type: MapObjectTypeID) {
        super();
        this.type = type;
        // this.on_destroy = new ListenerSocket<ObjectDestroyedEvent>();
        // this.on_attack = new ListenerSocket<ObjectAttacksEvent>();
        // this.on_touched_by = new ListenerSocket<ObjectTouchedEvent>();
        // this.on_damaged_by = new ListenerSocket<ObjectDamagedEvent>();
        // this.on_position_change = new ValueChangeListenerSocket<Field>();
        // this.on_before_position_change = new ValueChangeFilterSocket<Field>(true);
        // this.position = position;
        this._is_destroyed = false;
    }

    // public move_to(map: WorldMap<TerrainTypeID>, target: Point): boolean {
    //     const old_field = map.at(this.position);
    //     const new_field = map.at(target);
    //     if (old_field === null || new_field === null) return false;
    //     const event = {
    //         old: old_field,
    //         new: new_field
    //     };
    //     const is_allowed = this.on_before_position_change.trigger_event(event);
    //     if (!is_allowed) return false;
    //     this.on_position_change.trigger_event(event);
    //     map.update_field_at_point(this.position, { objects: [] });
    //     if (!this._is_destroyed) map.update_field_at_point(target, { objects: [this] });
    //     this.position = target;
    //     return true;
    // }

    // public attack(field: Field, attack_type: DamageType): this {
    //     this.on_attack.trigger_event({
    //         attacker: this,
    //         target: field,
    //         attack_type
    //     });
    //     return this;
    // }

    // public touched_by(other: MapObject): this {
    //     this.on_touched_by.trigger_event({
    //         actor: this,
    //         target: other,
    //     });
    //     return this;
    // };

    // public damage(damage: DamageDescription): this {
    //     this.on_damaged_by.trigger_event({
    //         victim: this,
    //         damage
    //     });
    //     return this;
    // };

    // public regen(amount: number): this {
    //     return this;
    // }


    public destroy(): void {
        this._is_destroyed = true;
    }

    public is_destroyed(): boolean {
        return this._is_destroyed;
    }

    public handle(game_state: GameState, task: Task): GameState {
        return super.get_all().reduce((game_state, component) => { return component.handle(game_state, task, this); }, game_state);
    }

    public update(delta_seconds: number): Task[] {
        return super.update(delta_seconds, this);
    }
}
import ComponentContainer from "../components/ComponentContainer"; import MapObjectComponent from "../components/MapObjectComponent"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import { GameState } from "../../main/GameState"; import { Task } from "../tasks/Task";


export type ObjectID = number;

export default abstract class MapObject extends ComponentContainer<MapObjectComponent>{
    private static next_instance_ID: ObjectID = 0;
    private static all_instances: MapObject[] = [];
    public readonly instance_ID: ObjectID = MapObject.next_instance_ID++;
    public readonly type: MapObjectTypeID;
    private _is_destroyed: boolean;

    constructor(type: MapObjectTypeID) {
        super();
        this.type = type;
        this._is_destroyed = false;
        MapObject.all_instances[this.instance_ID] = this;
    }

    public destroy(): void {
        this._is_destroyed = true;
        delete MapObject.all_instances[this.instance_ID];
    }

    public is_destroyed(): boolean {
        return this._is_destroyed;
    }

    public handle(game_state: GameState, task: Task): GameState {
        return super.get_all().reduce((game_state, component) => { return component.handle(game_state, task, this); }, game_state);
    }

    public update(delta_seconds: number, game_state: GameState): Task[] {
        return super.update(delta_seconds, this, game_state);
    }

    public static get(id: ObjectID): MapObject | undefined {
        return MapObject.all_instances[id];
    }
}
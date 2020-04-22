import MapObjectComponent from "./MapObjectComponent"; import { Point } from "../../ts_library/space/SimpleShapes"; import { GameState } from "../../main/GameState"; import { Task } from "../tasks/Task"; import MapObject from "../objects/MapObject"; import { MoveObjectTask } from "../tasks/MoveObjectTask";

export enum CollisionGroups {

    GHOST = 0,
    COLLECTABLE = 0b1,
    INTERACTABLE = 0b10,
    MOVEABLE = 0b100,

    UNPASSABLE = 0b1111,
}

export class PositionComponent extends MapObjectComponent {
    public static NAME = "position";
    public position: Point = new Point(0, 0);
    // collision_mask & collision_group === 0  => can walk here 
    public collision_mask: number = CollisionGroups.GHOST;
    public collision_group: number = CollisionGroups.UNPASSABLE;

    constructor() {
        super(PositionComponent.NAME);
    }

    public handle(game_state: GameState, task: Task, self: MapObject): GameState {
        if (task instanceof MoveObjectTask) {
            this.position = task.target;
        }
        return game_state;
    };
}
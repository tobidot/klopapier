import { Task } from "./Task";
import { GameState } from "../../main/GameState";
import MapObject, { ObjectID } from "../objects/MapObject";

export default class DestroyObjectTask extends Task {
    constructor(public readonly object_id: ObjectID) {
        super();
    }
    public execute(game_state: GameState): GameState {
        const object = MapObject.get(this.object_id);
        if (object) object.destroy();
        return game_state;
    }
}
import MapObject, { ObjectID } from "../../map/objects/abstract/MapObject";
import { Task } from "../Task";
import { GameState } from "../../../main/GameState";
import Field from "../../map/Field";

export default class DamageObjectTask extends Task {
    constructor(public target_id: ObjectID, public amount: number) {
        super();
    };
    public execute(game_state: GameState): GameState {
        //throw new Error("Method not implemented.");
        return game_state;
    }
}
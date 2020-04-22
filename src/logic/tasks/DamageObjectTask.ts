import { Task } from "./Task"; import { ObjectID } from "../objects/MapObject"; import { GameState } from "../../main/GameState";

export default class DamageObjectTask extends Task {
    constructor(public target_id: ObjectID, public amount: number) {
        super();
    };
    public execute(game_state: GameState): GameState {
        //throw new Error("Method not implemented.");
        return game_state;
    }
}
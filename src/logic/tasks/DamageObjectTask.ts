import { Task } from "./Task"; import MapObject, { ObjectID } from "../objects/MapObject"; import { GameState } from "../../main/GameState";
import HitPointsComponent from "../components/HitPointsComponent";

export default class DamageObjectTask extends Task {
    constructor(public target_id: ObjectID, public amount: number) {
        super();
    };

    public execute(game_state: GameState): GameState {
        const object = MapObject.get(this.target_id);
        if (!object) return game_state;
        const health = object.get(HitPointsComponent);
        if (!health) return game_state;
        health.current -= this.amount;
        return game_state;
    }
}
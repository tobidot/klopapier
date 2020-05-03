import System from "./System";
import { GameState, GameCalculatedState } from "../../main/GameState";
import InfectedSpreadComponent from "../components/InfectedSpreadComponent";
import MapObject from "../objects/MapObject";
import { MapFieldData } from "../../loading/MapData";
import Field from "../map/Field";
import IsHumanComponent from "../components/IsHumanComponent";

export default class CalculateInformationSystem extends System {

    public update(delta_seconds: number, game_state: GameState): GameState {
        const new_calculated_state: GameCalculatedState = {
            remaining_humans: 0,
            remaining_virusses: 0,
        };
        const all_fields = game_state.world_map.get_fields_in_rect(game_state.world_map.get_map_boundries());
        const calculated_state = all_fields.reduce((calculated_state, field): GameCalculatedState => {
            calculated_state = this.update_calculations_from_objects(calculated_state, field.objects);
            return calculated_state;
        }, new_calculated_state);
        return Object.assign(game_state, { calculated: calculated_state });
    }

    private update_calculations_from_objects(calculated_state: GameCalculatedState, objects: Array<MapObject>) {
        return objects.reduce((calculated_state, next) => {
            if (next.has(InfectedSpreadComponent)) calculated_state.remaining_virusses += 1;
            if (next.has(IsHumanComponent)) calculated_state.remaining_humans += 1;
            return calculated_state;
        }, calculated_state);
    }
}
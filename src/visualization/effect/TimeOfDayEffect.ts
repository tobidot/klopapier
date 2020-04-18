import { GameState } from "../../main/GameState";

export default class TimeOfDayEffect {
    constructor(private context: CanvasRenderingContext2D) {

    }

    public display(delta_seconds: number, game_state: GameState) {
        const time_of_day_p = (game_state.time_of_day / 24);
        if (time_of_day_p < 0.25 || time_of_day_p > 0.75) {
            const time_of_night_p = ((time_of_day_p + 1 - 0.75) % 1) * 2;
            const strength = (time_of_day_p - 0.25) * (time_of_day_p - 0.75) * 4;
            this.context.fillStyle = "hsla(" + ((time_of_night_p * 0.25 + 0.5) * 365) % 356 + ", 90%, 10%, " + strength + ")";
            this.context.fillRect(0, 0, 20 * 32, 15 * 32);
        }
    }
}
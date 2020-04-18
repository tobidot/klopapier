import { GameState } from "../../main/GameState";

export default class LoosingScreen {
    constructor(private context: CanvasRenderingContext2D) {

    }

    public display(delta_seconds: number, game_state: GameState) {
        this.context.font = '64px gothic';
        this.context.fillStyle = 'green';
        this.context.fillText('You survived', 50, 50, 200);
        this.context.font = '48px fantasy';
        this.context.fillStyle = 'gold';
        this.context.fillText('Day ' + game_state.time_of_day, 150, 150, 200);

        this.context.font = '24px fantasy';
        this.context.fillStyle = 'white';
        this.context.fillText('Press SPACE to continue', 200, 550, 300);
    }
}
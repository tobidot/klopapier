import { GameState } from "../../main/GameState";

export default class LoosingScreen {
    constructor(private context: CanvasRenderingContext2D) {

    }

    public display(delta_seconds: number, game_state: GameState) {
        this.context.font = '64px gothic';
        this.context.fillStyle = 'red';
        this.context.fillText('You died', 50, 50, 200);
        this.context.font = '48px fantasy';
        this.context.fillStyle = 'gold';
        this.context.fillText('Day ' + game_state.day, 150, 150, 200);

        this.context.font = '24px fantasy';
        this.context.fillStyle = 'white';
        this.context.fillText('Press SPACE to retry', 200, 550, 300);
        this.context.font = '16px fantasy';
        this.context.fillText('Press ESC to skip level', 500, 550, 200);
    }
}
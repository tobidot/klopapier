export default class FpsCounter {
    private average_over_x_frames: number;
    private steps_until_update: number;
    private last_time_stamp: number;
    private current_fps: number;

    public constructor(average_over_x_frames: number = 60, expected_fps: number = 60) {
        this.last_time_stamp = performance.now();
        this.steps_until_update = this.average_over_x_frames = average_over_x_frames;
        this.current_fps = expected_fps;
    }

    public get_current_fps(): number {
        return this.current_fps;
    }

    public update() {
        if (this.steps_until_update-- < 0) {
            const now = performance.now();
            const time_diff = Math.min(1000, now - this.last_time_stamp);
            const frames_per_ms = this.average_over_x_frames / time_diff;
            this.current_fps = 1000 * frames_per_ms;
            this.steps_until_update = this.average_over_x_frames;
            this.last_time_stamp = now;
        }
    }

}
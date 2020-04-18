import { WorldMapVisualizer } from "../visualization/visualize_world/WorldMapVisualizer"
import InventarOnScreen from "../visualization/InventarOnScreen"
import HungerOnScreen from "../visualization/HungerOnScreen"
import LifeOnScreen from "../visualization/LifeOnScreen"
import DayTimeOnScreen from "../visualization/DayTimeOnScreen"
import InfectionOnScreen from "../visualization/InfectionOnScreen"
import display_number_on_screen from "../visualization/NumberOnScreen"
import WorldMapVisualizerDefault from "../visualization/visualize_world/default/WorldMapVisualizerDefault"
import { Point, Rect } from "../ts_library/space/SimpleShapes"
import ImageManager from "../manager/ImageManager"
import { GameState } from "./GameState"
import { GameMode } from "./GameMode"
import LoosingScreen from "../visualization/screens/LoosingScreen"
import WinningScreen from "../visualization/screens/WinningScreen"

export default class GameVisualizer {
    private fps_counter: (print: number) => void;
    private world_map: WorldMapVisualizer;
    private inventar: InventarOnScreen;
    private hunger: HungerOnScreen;
    private life: LifeOnScreen;
    private daytime: DayTimeOnScreen;
    private infection: InfectionOnScreen;

    private loosing_screen: LoosingScreen;
    private winning_screen: WinningScreen;

    constructor(context: CanvasRenderingContext2D, images: ImageManager) {
        this.fps_counter = display_number_on_screen(context)(0, 0);
        this.inventar = new InventarOnScreen(context, images, new Point(150, 500), new Point(2, 8));
        this.hunger = new HungerOnScreen(context, images, Rect.from_boundries(0, 500, 650, 550));
        this.life = new LifeOnScreen(context, images, Rect.from_boundries(0, 550, 650, 600));
        this.daytime = new DayTimeOnScreen(context, images, Rect.from_boundries(650, 500, 800, 600));
        this.infection = new InfectionOnScreen(context, images, Rect.from_boundries(400, 0, 650, 50));

        this.loosing_screen = new LoosingScreen(context);
        this.winning_screen = new WinningScreen(context);

        this.world_map = new WorldMapVisualizerDefault(context, images);
        this.world_map.camera.map_source_rect = Rect.from_boundries(0, 0, 10, 10);
        this.world_map.camera.display_target_rect = Rect.from_boundries(0, 0, 600, 500);
    }

    public display(delta_seconds: number, game_state: GameState) {
        switch (game_state.modus) {
            case GameMode.INTERSECTION:
                break;
            case GameMode.PLAYING:
            case GameMode.LOADING:
            case GameMode.PAUSE:
            default:
                this.display_playing(delta_seconds, game_state);
                break;
        }
    }

    private display_playing(delta_seconds: number, game_state: GameState) {
        this.world_map.camera.map_source_rect.set_center(game_state.camera_position);
        this.world_map.display(game_state.world_map, delta_seconds);

        // this.visualizers.inventar.display(this.object);
        // this.visualizers.hunger.display(this.object);

        // this.context.fillStyle = "gray";
        //this.context.fillRect(650, 500, 150, 100);
        this.daytime.display(game_state.time_of_day / 24, game_state.day);
        // this.visualizers.life.display(this.object);
        //this.visualizers.fps_counter(this.fps_counter.get_current_fps());
        //this.visualizers.infection.display(this.infection_count);


    }

    private display_intersection(delta_seconds: number, game_state: GameState) {
        //if (game_state.has_won)
        if (game_state.calculated.has_won) this.loosing_screen.display(delta_seconds, game_state);
        if (game_state.calculated.has_lost) this.winning_screen.display(delta_seconds, game_state);

        // if (this.current_intersect !== null && this.intersections[this.game_state.current_level]) {
        //     let intersect_image_id = this.intersections[this.game_state.current_level][this.current_intersect];
        //     if (intersect_image_id) {
        //         const image = this.images.get(intersect_image_id);
        //         this.context.drawImage(image, 0, 0);
        //     }
        // }
    }

}
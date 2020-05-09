import ImageManager from "./manager/ImageManager"; import FpsCounter from "./ts_library/utility/FpsCounter"; import CreateMap from "./logic/map/helper/CreateMap"; import { InputDelegator } from "./logic/user_input/Input"; import { Task } from "./logic/tasks/Task"; import System from "./logic/system/System"; import { GameState, GameCalculatedState, GameResult } from "./main/GameState"; import GameLevels from "./main/GameLevels"; import GameVisualizer from "./main/GameVisualizer"; import { Point } from "./ts_library/space/SimpleShapes"; import { GameMode } from "./main/GameMode"; import UpdateMapSystem from "./logic/system/UpdateMapSystem"; import TaskHandleSystem from "./logic/system/TaskHandleSystem"; import InputHandlingSystem from "./logic/system/InputHandlingSystem"; import { image_resources } from "./assets/ImageResources"; import Spray from "./logic/objects/Spray"; import Nudel from "./logic/objects/Nudel"; import Paperroll from "./logic/objects/Paperroll"; import Virus from "./logic/objects/Virus";
import FollowWithCameraComponent from "./logic/components/FollowWithCameraComponent";
import TimeOfDaySystem from "./logic/system/TimeOfDaySystem";
import InfectedSpreadComponent from "./logic/components/InfectedSpreadComponent";
import MapObject from "./logic/objects/MapObject";
import CalculateInformationSystem from "./logic/system/CalculateInformationSystem";
import WinOrLooseSystem from "./logic/system/WinOrLooseSystem";
import WorldMap from "./logic/map/WorldMap";
import Field from "./logic/map/Field";
import { TerrainTypeID } from "./assets/TerrainResources";
import RestartLevelSystemEvent from "./logic/system/events/RestartLevelSystemEvent";
import LevelLoaderSystem from "./logic/system/LevelLoaderSystem";

export default class Game {
    // Assets / Targets
    private context: CanvasRenderingContext2D;
    private images: ImageManager;

    // Various Helpers
    private fps_counter: FpsCounter = new FpsCounter(60, 60);


    //private players: Array<Player>;
    private input_delegator: InputDelegator;

    //
    private systems: Array<System> = [];
    private game_state: GameState;

    private visualizer: GameVisualizer;

    constructor(element: HTMLElement) {
        this.context = this.setup_dom_context(element);
        this.input_delegator = new InputDelegator(element);
        //

        // add visual representives        
        this.images = this.construct_image_manager();
        this.images.on_progress_listener.add(([progress, image]) => {
            const height = Math.min(image.height, this.context.canvas.height / 2);
            const width = image.width / image.height * height;
            this.context.drawImage(image,
                progress * this.context.canvas.width - width,
                this.context.canvas.height / 2 - height / 2,
                width, height);
        });



        this.game_state = {
            modus: GameMode.INITIAL,
            post_game_stats: {
                won_or_lost: GameResult.TIE,
            },
            current_level: 0,
            day: 0,
            time_of_day: 6,

            world_map: new WorldMap(5, 5, (map, x, y): Field => {
                return { location: new Point(x, y), objects: [], terrain: { type: TerrainTypeID.OUTDOOR_GRAS, variation_key: 0 } };
            }),
            camera_position: new Point(3, 3),
            selected: null,

            tasks: [],
            calculated: {
                remaining_virusses: 0,
                remaining_humans: 0,
            },
        }

        // Visualizer
        this.visualizer = new GameVisualizer(this.context, this.images);


        this.systems = [
            new LevelLoaderSystem(),
            new CalculateInformationSystem(),
            new WinOrLooseSystem(),
            new TimeOfDaySystem(),
            new UpdateMapSystem(),
            new TaskHandleSystem(),
            new InputHandlingSystem(this.input_delegator),
        ];
        System.events.add((event) => {
            this.systems.forEach((system) => {
                system.handle(event);
            });
        });
    }

    private setup_dom_context(element: HTMLElement): CanvasRenderingContext2D {
        // Link with dom
        let canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        element.innerHTML = '';
        element.appendChild(canvas);
        let context = canvas.getContext('2d');
        if (!context) throw new Error('Could not create canvas context');
        return this.context = context;
    }


    private construct_image_manager(): ImageManager {
        return new ImageManager(image_resources);
    }

    async start() {
        await this.images.wait_until_loaded();
        // this.levels = map_images.map(load_mapdata_from_image);
        System.events.trigger_event(new RestartLevelSystemEvent());
        this.game_state.modus = GameMode.PLAYING;
        let last_update = performance.now();
        const update = (() => {
            const now = performance.now();
            const delta_seconds = Math.min(0.013, (now - last_update) / 1000);
            this.fps_counter.update();
            this.update(delta_seconds);
            this.draw(delta_seconds);
            requestAnimationFrame(update);
            last_update = now;
        });
        update();
    }

    update(delta_seconds: number) {
        this.game_state = this.systems.reduce((game_state, system) => {
            return system.update(delta_seconds, this.game_state);
        }, this.game_state);
    }

    draw(delta_seconds: number) {
        this.context.clearRect(0, 0, 800, 600);

        this.visualizer.display(delta_seconds, this.game_state);
    }
}
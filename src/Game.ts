import ImageManager from "./manager/ImageManager";
import { Point, Rect } from "./ts_library/space/SimpleShapes";
import FpsCounter from "./ts_library/utility/FpsCounter";
import Paperroll from "./logic/map/objects/Klopapier";
import { image_resources, ImageID } from "./assets/ImageResources";
import Virus from "./logic/map/objects/Virus";
import Nudel from "./logic/map/objects/Nudel";
import Spray from "./logic/map/objects/Spray";
import { Task } from "./logic/flow/Task";
import { GameState } from "./main/GameState";
import { GameMode } from "./main/GameMode";
import CreateMap from "./logic/map/helper/CreateMap";
import GameInputHandler from "./main/GameInputHandler";
import GameVisualizer from "./main/GameVisualizer";
import GameLevels from "./main/GameLevels";
import { InputDelegator } from "./logic/user_input/Input";
import System from "./logic/system/System";
import { set_camera_position, SetCameraPosition } from "./logic/flow/tasks/SetCameraPosition";
import UpdateMapSystem from "./logic/system/UpdateMap";
import TaskHandleSystem from "./logic/system/TaskHandleSystem";

export default class Game {
    // Assets / Targets
    private context: CanvasRenderingContext2D;
    private images: ImageManager;

    // Various Helpers
    private fps_counter: FpsCounter = new FpsCounter(60, 60);
    private creator_map: CreateMap = new CreateMap();


    //private players: Array<Player>;
    private input_delegator: InputDelegator;
    private input_handler: GameInputHandler;

    // 
    private tasks: Array<Task> = [];
    private systems: Array<System> = [];
    private game_state: GameState;

    private level_handler: GameLevels;
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


        // load levels 
        this.level_handler = new GameLevels();


        this.game_state = {
            current_level: 0,
            camera_position: new Point(3, 3),
            world_map: this.creator_map.build(this.level_handler.current().map_data),
            time_of_day: this.level_handler.current().start_day_time,
            day: 0,
            modus: GameMode.INITIAL,

            tasks: [],
            calculated: {
                has_lost: false,
                has_won: false,
            },
        }


        // Handle Input
        this.input_handler = new GameInputHandler(this.input_delegator, this.game_state);

        // Visualizer
        this.visualizer = new GameVisualizer(this.context, this.images);


        this.systems = [
            new UpdateMapSystem(),
            new TaskHandleSystem(),
        ]
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

    private reset_level() {
        // this.objects.map((object) => object.destroy());
        // this.objects = [];

        this.game_state.time_of_day = this.level_handler.current().start_day_time;
        this.game_state.world_map = this.creator_map.build(this.level_handler.current().map_data);

        // this.object = new Agent(new Point(map_data.player_x, map_data.player_y));
        // this.game_state.camera_position = this.object.get_position();
    }

    private construct_image_manager(): ImageManager {
        return new ImageManager(image_resources);
    }

    async start() {

        await this.images.wait_until_loaded();
        // this.levels = map_images.map(load_mapdata_from_image);
        this.reset_level();


        setInterval(() => {
            this.fps_counter.update();
            this.update(1 / this.fps_counter.get_current_fps());
            this.draw(1 / this.fps_counter.get_current_fps());
        }, 1000.0 / 60.0);
    }

    update(delta_seconds: number) {
        if (this.game_state.modus) return;
        // keep an eye on win/loose condition
        // this.infection_count = this.objects.reduce((count, object) => object instanceof Virus ? count + 1 : count, 0);

        // -- Spawn Items
        // this.time_to_refresh_items -= delta_seconds;
        // const should_refreshing_items = this.time_to_refresh_items < 0;
        // const chance_to_spawn_items = Math.min(0.1, 8 / (this.day * (this.day + 2) + 70));
        // if (should_refreshing_items) this.time_to_refresh_items += 4;
        // this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
        //     if (!should_refreshing_items) return field;
        //     if (field.objects) return field;
        //     if (Math.random() < chance_to_spawn_items || this.bad_luck_protection > 1) {
        //         this.bad_luck_protection = 0;
        //         switch (field.terrain.type) {
        //             case TerrainTypeID.INDOOR_TOILET:
        //                 this.create_object(Paperroll, field.location);
        //                 break;
        //             case TerrainTypeID.INDOOR_TABLE:
        //                 this.create_object(Nudel, field.location);
        //                 break;
        //             case TerrainTypeID.INDOOR_CLINICAL_PALLETTE:
        //                 this.create_object(Spray, field.location);
        //                 break;
        //         }
        //     } else {
        //         this.bad_luck_protection += chance_to_spawn_items;
        //     }
        //     return field;
        // });


        // Control time of day
        // this.time_of_day += delta_seconds / 2;
        // if (this.time_of_day >= 24) {
        //     this.day++;
        //     this.time_of_day -= 24;
        //     this.paper_kiled = -1;
        // }

        // Destroy Paper
        // if (this.time_of_day >= this.paper_kiled + 1) {
        //     this.paper_kiled = Math.floor(this.time_of_day);
        //     const config_chance_for_paper_to_enflame = 0.01;
        //     this.fires = this.fires.reduce((new_list: Point[], pos: Point): Point[] => {
        //         const field = this.world_map.at(pos);
        //         [Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.UP].map((direction: Direction) => {
        //             const target = pos.add(direction_to_point(direction, 1));
        //             const target_field = this.world_map.at(target);
        //             if (target_field && target_field.terrain.variation_key === "with_paper") {
        //                 this.world_map.effect(target);
        //                 this.world_map.update_field_at_point(target, {
        //                     terrain: {
        //                         type: target_field.terrain.type,
        //                         variation_key: "default",
        //                     }
        //                 });
        //                 new_list.push(target);
        //             }
        //         });
        //         return new_list;
        //     }, new Array<Point>());

        //     if (this.time_of_day >= 8 && this.time_of_day < 16) {
        //         this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
        //             if (field.terrain.type === TerrainTypeID.OUTDOOR_GRAS && field.terrain.variation_key === "with_paper") {
        //                 if (Math.random() < config_chance_for_paper_to_enflame) {
        //                     const target_pos = field.location;
        //                     this.world_map.effect(target_pos);
        //                     this.fires.push(target_pos);
        //                     return Object.assign({}, field, {
        //                         terrain: {
        //                             type: field.terrain.type,
        //                             variation_key: "default",
        //                         }
        //                     });
        //                 }
        //             }
        //             return field;
        //         });
        //     }
        //     this.fires = [...new Set(this.fires)];
        // }

        this.game_state = this.systems.reduce((game_state, system) => {
            return system.update(delta_seconds, this.game_state);
        }, this.game_state);


        // if (!this.has_won && this.objects.filter((object) => object instanceof Virus).length === 0) {
        //     this.has_won = true;
        //     this.current_level = (this.current_level + 1) % this.levels.length;
        // }
        // if (!this.has_lost && this.object.is_destroyed()) this.has_lost = true;
    }

    draw(delta_seconds: number) {
        this.context.clearRect(0, 0, 800, 600);

        this.visualizer.display(delta_seconds, this.game_state);
    }



    public create_object(object_constructor: CreateableObjectTypes, pos: Point) {
        // this.to_add_objects.push(new object_constructor(this.world_map, pos));
    }
}

type CreateableObjectTypes = typeof Spray | typeof Nudel | typeof Paperroll | typeof Virus;
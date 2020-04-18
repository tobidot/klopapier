import ImageManager from "./manager/ImageManager";
import { randomBytes } from "crypto";
import WorldMap, { FieldGenerator } from "./logic/map/WorldMap";
import Terrain from "./logic/map/Terrain";
import { Point, Rect } from "./ts_library/space/SimpleShapes";
import Field from "./logic/map/Field";
import { TerrainTypeID } from "./assets/TerrainResources";
import FpsCounter from "./ts_library/utility/FpsCounter";
import display_number_on_screen from "./visualization/NumberOnScreen";
import WorldMapVisualizerDefault from "./visualization/visualize_world/default/WorldMapVisualizerDefault";
import { InputDelegator } from "./logic/user_input/Input";
import { Direction } from "./ts_library/space/Direction";
import InventarOnScreen from "./visualization/InventarOnScreen";
import Paperroll from "./logic/map/objects/Klopapier";
import { image_resources, ImageID } from "./assets/ImageResources";
import Virus from "./logic/map/objects/Virus";
import MapObject from "./logic/map/objects/abstract/MapObject";
import Nudel from "./logic/map/objects/Nudel";
import Spray from "./logic/map/objects/Spray";
import HungerOnScreen from "./visualization/HungerOnScreen";
import LifeOnScreen from "./visualization/LifeOnScreen";
import DayTimeOnScreen from "./visualization/DayTimeOnScreen";
import InfectedWalkingComponent from "./logic/map/objects/components/InfectedWalkingComponent";
import InfectedSpreadComponent from "./logic/map/objects/components/InfectedSpreadComponent";
import MapData, { MapFieldData } from "./logic/data/MapData";
import InfectionOnScreen from "./visualization/InfectionOnScreen";
import { load_mapdata_from_image_array } from "./logic/data/MapDataLoader";
import { map1 } from "./assets/images/maps/map1";
import { map2 } from "./assets/images/maps/map2";
import { map3 } from "./assets/images/maps/map3";
import { map4 } from "./assets/images/maps/map4";
import { map5 } from "./assets/images/maps/map5";
import { map6 } from "./assets/images/maps/map6";
import { map7 } from "./assets/images/maps/map7";
import { map8 } from "./assets/images/maps/map8";
import { map9 } from "./assets/images/maps/map9";
import { WorldMapVisualizer } from "./visualization/visualize_world/WorldMapVisualizer";
import { Task } from "./logic/flow/Task";
import { GameState } from "./main/GameState";
import { GameMode } from "./main/GameMode";
import CreateMap from "./logic/map/helper/CreateMap";

export default class Game {
    // Assets / Targets
    private context: CanvasRenderingContext2D;
    private images: ImageManager;

    // Various Helpers
    private fps_counter: FpsCounter = new FpsCounter(60, 60);
    private creator_map: CreateMap = new CreateMap();


    //private players: Array<Player>;
    private input_delegator: InputDelegator;



    private to_add_objects: Array<MapObject> = [];
    private infection_count: number = 0;

    private tasks: Array<Task> = [];
    private game_state: GameState;

    public bad_luck_protection = 0;
    public time_to_refresh_items: number = 0;
    public time_of_day: number = 0;
    public day: number = 0;

    public paper_kiled: number = 0;
    public fires: Array<Point> = [];

    public has_won: boolean = false;
    public has_lost: boolean = false;
    private levels: MapData[] = [
        map1,
        map2,
        map3,
        map4,
        map5,
        map6,
        map7,
        map8,
        map9,
    ].map((map_data: { width: number, height: number, data: number[] }) =>
        load_mapdata_from_image_array(map_data.width, map_data.height, map_data.data)
    );
    private intersections: Array<Array<ImageID>> = [
        [ImageID.TUTORIAL__LEVEL1,],
        [ImageID.TUTORIAL__LEVEL2,],
        [ImageID.TUTORIAL__LEVEL3,],
        [ImageID.TUTORIAL__LEVEL4,],
        [ImageID.TUTORIAL__LEVEL5,],
        [ImageID.TUTORIAL__LEVEL6,],
        [ImageID.TUTORIAL__LEVEL7,],
        [ImageID.TUTORIAL__LEVEL8,],
        [ImageID.TUTORIAL__LEVEL9,],
    ];
    private current_intersect: number | null = 0;

    private visualizers: {
        fps_counter: (print: number) => void,
        world_map: WorldMapVisualizer,
        inventar: InventarOnScreen,
        hunger: HungerOnScreen,
        life: LifeOnScreen,
        daytime: DayTimeOnScreen,
        infection: InfectionOnScreen,
    };

    constructor(element: HTMLElement) {
        // Static instance Component Reference
        InfectedWalkingComponent.game = this;
        InfectedSpreadComponent.game = this;

        // Link with dom
        let canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        let context = canvas.getContext('2d');
        if (!context) throw new Error('Could not create canvas context');
        this.context = context;
        element.innerHTML = '';
        element.appendChild(canvas);
        this.input_delegator = new InputDelegator(element);
        //

        // Handle Input
        this.input_delegator.on_direction_input = this.on_input_direction;
        this.input_delegator.on_attack_input = this.on_input_attack;
        this.input_delegator.on_use_paper = this.on_input_use_paper;
        this.input_delegator.on_use_spray = this.on_input_use_spray;
        this.input_delegator.on_eat = this.on_input_eat;
        this.input_delegator.on_request_menu = () => {
            if (this.has_won || this.has_lost) this.game_state.current_level++;
            this.reset_level();
        }
        this.input_delegator.on_interact = () => {
        }
        this.input_delegator.on_pause = () => {
            if (this.current_intersect !== null) this.current_intersect = null;
            if (this.has_won || this.has_lost) this.reset_level();
        }

        // add visual representives        
        this.images = this.construct_image_manager();
        this.images.on_progress_listener.add(([progress, image]) => {
            this.context.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
        });


        // load map
        this.creator_map.map_data = this.levels[0];

        this.game_state = {
            current_level: 0,
            camera_position: new Point(0, 0),
            world_map: this.creator_map.build(),
            time_of_day: this.creator_map.get_start_time_of_day(),
            modus: GameMode.INITIAL
        }

        this.visualizers = {
            fps_counter: display_number_on_screen(this.context)(0, 0),
            world_map: new WorldMapVisualizerDefault(this.context, this.images),
            inventar: new InventarOnScreen(this.context, this.images, new Point(150, 500), new Point(2, 8)),
            hunger: new HungerOnScreen(this.context, this.images, Rect.from_boundries(0, 500, 650, 550)),
            life: new LifeOnScreen(this.context, this.images, Rect.from_boundries(0, 550, 650, 600)),
            daytime: new DayTimeOnScreen(this.context, this.images, Rect.from_boundries(650, 500, 800, 600)),
            infection: new InfectionOnScreen(this.context, this.images, Rect.from_boundries(400, 0, 650, 50)),
        };
        this.visualizers.world_map.camera.map_source_rect = Rect.from_boundries(0, 0, 10, 10);
        this.visualizers.world_map.camera.display_target_rect = Rect.from_boundries(0, 0, 600, 500);
    }

    private reset_level() {
        this.current_intersect = 0;
        this.input_delegator.game_over = this.has_won = this.has_lost = false;
        // this.objects.map((object) => object.destroy());
        // this.objects = [];

        const map_data: MapData = this.levels[this.game_state.current_level];
        this.time_of_day = map_data.start_day_time;
        this.game_state.world_map = this.creator_map.build(map_data);

        // this.object = new Agent(new Point(map_data.player_x, map_data.player_y));
        // this.game_state.camera_position = this.object.get_position();
    }

    private construct_image_manager(): ImageManager {
        return new ImageManager(image_resources);
    }

    async start() {
        const level_container = document.getElementById('levels');
        if (!level_container) throw new Error('Could not find level container.');

        await this.images.wait_until_loaded();
        // this.levels = map_images.map(load_mapdata_from_image);
        this.reset_level();


        const map_images = [
            this.images.get(ImageID.MAPS__MAP1),
            this.images.get(ImageID.MAPS__MAP2),
            this.images.get(ImageID.MAPS__MAP3),
            this.images.get(ImageID.MAPS__MAP4),
            this.images.get(ImageID.MAPS__MAP5),
            this.images.get(ImageID.MAPS__MAP6),
            this.images.get(ImageID.MAPS__MAP7),
            this.images.get(ImageID.MAPS__MAP8),
            this.images.get(ImageID.MAPS__MAP9),
        ];
        map_images.forEach((image, index) => {
            level_container.appendChild(image);
            image.addEventListener('click', () => {
                this.game_state.current_level = index;
                this.reset_level();
            });
        });

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


        this.tasks.forEach((task) => this.handle(task));
        this.tasks = [];


        // if (!this.has_won && this.objects.filter((object) => object instanceof Virus).length === 0) {
        //     this.has_won = true;
        //     this.current_level = (this.current_level + 1) % this.levels.length;
        // }
        // if (!this.has_lost && this.object.is_destroyed()) this.has_lost = true;
    }

    draw(delta_seconds: number) {
        this.context.clearRect(0, 0, 800, 600);
        if (this.has_won) {
            this.draw_win_screen();
            return;
        } else if (this.has_lost) {
            this.draw_loose_screen();
            return;
        }

        this.visualizers.world_map.camera.map_source_rect.set_center(this.game_state.camera_position);
        this.visualizers.world_map.display(this.game_state.world_map, delta_seconds);

        const time_of_day_p = (this.time_of_day / 24);
        if (time_of_day_p < 0.25 || time_of_day_p > 0.75) {
            const time_of_night_p = ((time_of_day_p + 1 - 0.75) % 1) * 2;
            const strength = (time_of_day_p - 0.25) * (time_of_day_p - 0.75) * 4;
            this.context.fillStyle = "hsla(" + ((time_of_night_p * 0.25 + 0.5) * 365) % 356 + ", 90%, 10%, " + strength + ")";
            this.context.fillRect(0, 0, 20 * 32, 15 * 32);
        }

        // this.visualizers.inventar.display(this.object);
        // this.visualizers.hunger.display(this.object);

        this.context.fillStyle = "gray";
        //this.context.fillRect(650, 500, 150, 100);
        this.visualizers.daytime.display(this.time_of_day / 24, this.day);
        // this.visualizers.life.display(this.object);
        //this.visualizers.fps_counter(this.fps_counter.get_current_fps());
        //this.visualizers.infection.display(this.infection_count);
        if (this.current_intersect !== null && this.intersections[this.game_state.current_level]) {
            let intersect_image_id = this.intersections[this.game_state.current_level][this.current_intersect];
            if (intersect_image_id) {
                const image = this.images.get(intersect_image_id);
                this.context.drawImage(image, 0, 0);
            }
        }
    }

    draw_loose_screen() {
        this.context.font = '64px gothic';
        this.context.fillStyle = 'red';
        this.context.fillText('You died', 50, 50, 200);
        this.context.font = '48px fantasy';
        this.context.fillStyle = 'gold';
        this.context.fillText('Day ' + this.day, 150, 150, 200);

        this.context.font = '24px fantasy';
        this.context.fillStyle = 'white';
        this.context.fillText('Press SPACE to retry', 200, 550, 300);
        this.context.font = '16px fantasy';
        this.context.fillText('Press ESC to skip level', 500, 550, 200);
        this.input_delegator.game_over = true;
        return;
    }

    draw_win_screen() {
        this.context.font = '64px gothic';
        this.context.fillStyle = 'green';
        this.context.fillText('You survived', 50, 50, 200);
        this.context.font = '48px fantasy';
        this.context.fillStyle = 'gold';
        this.context.fillText('Day ' + this.day, 150, 150, 200);

        this.context.font = '24px fantasy';
        this.context.fillStyle = 'white';
        this.context.fillText('Press SPACE to continue', 200, 550, 300);
        this.input_delegator.game_over = true;
        return;
    }

    private handle(task: Task) {
        switch (task.name) {
            case "move_object":
                console.log('move object');
                break;
            default:
                console.log('unhandled task');
                break;
        }
    }

    on_input_attack = () => {
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar || inventar.has('spray') === false) return;

        // let direction = this.object.look_direction;
        // let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        // let target_field = this.world_map.at(target_pos);
        // if (target_field) {
        //     this.object.attack(target_field, DamageType.SPRAY);
        // }
        // if (target_field && target_field.objects) {
        //     target_field.objects.forEach((object) => object.damage({
        //         type: DamageType.SPRAY,
        //         source: this.object,
        //         amount: 1,
        //     }));
        // }
    }

    on_input_direction = (direction: Direction): boolean => {
        // let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        // let target_field = this.world_map.at(target_pos);
        // if (target_field) {
        //     if (this.object.moving_progress !== false) return false;
        //     this.object.move_to(this.world_map, target_pos);
        //     this.camera_position = this.object.get_position();
        // }
        return true;
    }

    on_input_use_paper = () => {
        // const field_pos = this.object.get_position();
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar) return;
        // const has = inventar.has('paperroll') || inventar.has('paperroll_half') || inventar.has('paperroll_last');
        // if (!has) return;
        // const old_field = this.world_map.at(field_pos);
        // if (old_field && (old_field.terrain.variation_key === 'default') &&
        //     (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
        //     if (inventar.has('paperroll_last')) {
        //         inventar.remove('paperroll_last');
        //     } else if (inventar.has('paperroll_half')) {
        //         inventar.remove('paperroll_half');
        //         inventar.items.push('paperroll_last')
        //     } else if (inventar.has('paperroll')) {
        //         inventar.remove('paperroll');
        //         inventar.items.push('paperroll_half')
        //     }
        //     this.world_map.update_field_at_point(field_pos, {
        //         terrain: {
        //             type: old_field.terrain.type,
        //             variation_key: 'with_paper',
        //         }
        //     });
        // }
    }

    on_input_use_spray = () => {
        // const field_pos = this.object.get_position();
        // const inventar = this.object.components.get(InventarComponent);
        // if (!inventar || inventar.has('spray') === false) return;

        // const old_field = this.world_map.at(field_pos);
        // if (inventar.items.length > 0 && old_field && (old_field.terrain.variation_key === 'default' || old_field.terrain.variation_key === 'with_paper') &&
        //     (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
        //     inventar.remove('spray');
        //     this.world_map.update_field_at_point(field_pos, {
        //         terrain: {
        //             type: old_field.terrain.type,
        //             variation_key: 'with_spray',
        //         }
        //     });
        // }
    }

    on_input_eat = () => {
        // const inventar = this.object.components.get(InventarComponent);
        // const hunger = this.object.components.get(HungerComponent);
        // if (!inventar || inventar.has('nudel') === false) return;
        // inventar.remove('nudel');
        // if (!hunger) return;
        // hunger.urge_to_eat = Math.max(0, hunger.urge_to_eat - 40);

    }

    public create_object(object_constructor: CreateableObjectTypes, pos: Point) {
        // this.to_add_objects.push(new object_constructor(this.world_map, pos));
    }
}

type CreateableObjectTypes = typeof Spray | typeof Nudel | typeof Paperroll | typeof Virus;
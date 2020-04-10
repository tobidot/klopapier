import ImageManager from "./manager/ImageManager";
import { randomBytes } from "crypto";
import WorldMap, { FieldGenerator } from "./logic/map/WorldMap";
import Terrain from "./logic/map/Terrain";
import { Point, Rect } from "./ts_library/space/SimpleShapes";
import Field from "./logic/map/Field";
import { TerrainTypeID } from "./assets/TerrainResources";
import FpsCounter from "./ts_library/utility/FpsCounter";
import display_number_on_screen from "./visualization/NumberOnScreen";
import WorldMapOnScreen from "./visualization/WorldMapOnScreen";
import { InputDelegator } from "./logic/user_input/Input";
import { Direction } from "./ts_library/space/Direction";
import { direction_to_point } from "./ts_library/conversion/fromDirection";
import MovingMapObject from "./logic/map/objects/abstract/MovingMapObject";
import { DamageType } from "./logic/fight/DamageType";
import Agent from "./logic/map/objects/Agent";
import InventarOnScreen from "./visualization/InventarOnScreen";
import Paperroll from "./logic/map/objects/Klopapier";
import { image_resources, ImageID } from "./assets/ImageResources";
import Virus from "./logic/map/objects/Virus";
import InventarComponent from "./logic/map/objects/components/InventarComponent";
import MapObject from "./logic/map/objects/abstract/MapObject";
import Nudel from "./logic/map/objects/Nudel";
import Spray from "./logic/map/objects/Spray";
import HungerOnScreen from "./visualization/HungerOnScreen";
import HungerComponent from "./logic/map/objects/components/HungerComponent";
import LifeOnScreen from "./visualization/LifeOnScreen";
import DayTimeOnScreen from "./visualization/DayTimeOnScreen";
import InfectedWalkingComponent from "./logic/map/objects/components/InfectedWalkingComponent";
import InfectedSpreadComponent from "./logic/map/objects/components/InfectedSpreadComponent";
import MapData from "./logic/data/MapData";
import { data as map1 } from "./logic/data/Map1";
import { data as map2 } from "./logic/data/Map2";
import { data as map3 } from "./logic/data/Map3";
import { runInThisContext } from "vm";
import InfectionOnScreen from "./visualization/InfectionOnScreen";
import { load_mapdata_from_image } from "./logic/data/MapDataLoader";

export default class Game {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private world_map: WorldMap<TerrainTypeID>;
    //private players: Array<Player>;
    private fps_counter: FpsCounter = new FpsCounter(60, 60);
    private camera_position: Point;
    private input_delegator: InputDelegator;

    private object: MovingMapObject;
    private objects: Array<MapObject>;
    private to_add_objects: Array<MapObject> = [];
    private infection_count: number = 0;

    public time_to_refresh_items: number = 0;
    public time_of_day: number = 0;
    public day: number = 0;
    public paper_kiled = false;

    public has_won: boolean = false;
    public has_lost: boolean = false;
    public current_level = 0;
    private levels = [
        map1,
        map2,
        map3
    ];

    private visualizers: {
        fps_counter: (print: number) => void,
        world_map: WorldMapOnScreen,
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
        this.input_delegator.on_direction_input = this.on_input_direction;
        this.input_delegator.on_attack_input = this.on_input_attack;
        this.input_delegator.on_use_paper = this.on_input_use_paper;
        this.input_delegator.on_use_spray = this.on_input_use_spray;
        this.input_delegator.on_eat = this.on_input_eat;
        this.input_delegator.on_request_menu = () => {
            this.current_level++;
            this.reset_level();
        }
        this.input_delegator.on_interact = () => {
            if (this.has_won || this.has_lost) this.reset_level();
        }


        // add visual representives        
        this.images = this.construct_image_manager();
        this.images.on_progress_listener.add(([progress, image]) => {
            this.context.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
        });

        // load map
        this.objects = [];
        const map_data: MapData = this.levels[this.current_level];
        this.time_of_day = map_data.start_day_time;
        this.world_map = this.construct_world_map(map_data);

        this.object = new Agent(new Point(map_data.player_x, map_data.player_y));
        this.world_map.add_object(this.object);
        this.objects.push(this.object);

        this.camera_position = this.object.get_position();

        this.visualizers = {
            fps_counter: display_number_on_screen(this.context)(0, 0),
            world_map: WorldMapOnScreen.build()(this.context)(this.images)(this.world_map)(new Point(19, 14))(32),
            inventar: new InventarOnScreen(this.context, this.images, new Point(150, 500), new Point(2, 8)),
            hunger: new HungerOnScreen(this.context, this.images, Rect.from_boundries(0, 500, 650, 550)),
            life: new LifeOnScreen(this.context, this.images, Rect.from_boundries(0, 550, 650, 600)),
            daytime: new DayTimeOnScreen(this.context, this.images, Rect.from_boundries(650, 500, 800, 600)),
            infection: new InfectionOnScreen(this.context, this.images, Rect.from_boundries(400, 0, 650, 50)),
        };
    }

    private reset_level() {
        this.input_delegator.game_over = this.has_won = this.has_lost = false;
        this.objects.map((object) => object.destroy());
        this.objects = [];

        const map_data: MapData = this.levels[this.current_level];
        this.time_of_day = map_data.start_day_time;
        this.world_map = this.construct_world_map(map_data);

        this.object = new Agent(new Point(map_data.player_x, map_data.player_y));
        this.world_map.add_object(this.object);
        this.objects.push(this.object);
        this.camera_position = this.object.get_position();

        this.visualizers.world_map = WorldMapOnScreen.build()(this.context)(this.images)(this.world_map)(new Point(19, 14))(32);
    }

    private construct_world_map(map_data: MapData): WorldMap<TerrainTypeID> {
        let field_generator: FieldGenerator<TerrainTypeID> = (map: WorldMap<TerrainTypeID>, x: number, y: number) => {
            const field_data = map_data.at(x, y);
            const possible_terrain = [
                TerrainTypeID.INDOOR_SHOP,
                TerrainTypeID.OUTDOOR_GRAS,
            ];
            const terrain: Terrain = {
                type: field_data.terrain,
                variation_key: 'default',
            };
            let object = null;
            if (field_data.object) {
                object = new field_data.object(map, new Point(x, y));
                this.objects.push(object);
            }
            const field: Field = { x, y, object, terrain };
            return field;
        };
        let map = WorldMap.factory()(map_data.width, map_data.height)(field_generator);
        return map;
    }

    private construct_image_manager(): ImageManager {
        return new ImageManager(image_resources);
    }

    async start() {
        await this.images.wait_until_loaded();

        let map_images = [
            ImageID.MAPS__MAP1,
            ImageID.MAPS__MAP2,
            ImageID.MAPS__MAP3,
            ImageID.MAPS__MAP4,
        ];
        this.levels = map_images.map(this.images.get.bind(this)).map(load_mapdata_from_image);
        this.reset_level();

        setInterval(() => {
            this.fps_counter.update();
            this.update(1 / this.fps_counter.get_current_fps());
            this.draw(1 / this.fps_counter.get_current_fps());
        }, 1000.0 / 60.0);
    }

    update(delta_seconds: number) {
        if (this.has_lost || this.has_won) return;
        this.to_add_objects = this.to_add_objects.filter((object: MapObject) => {
            const field = this.world_map.at(object.get_position());
            if (field) {
                if (field.object) return true;
                this.objects.push(object);
                this.world_map.add_object(object);
            }
            return false;
        });
        this.objects = this.objects.filter((object: MapObject) => {
            object.update(delta_seconds);
            return !object.is_destroyed();
        });
        this.infection_count = this.objects.reduce((count, object) => object instanceof Virus ? count + 1 : count, 0);

        this.time_to_refresh_items -= delta_seconds;
        const should_refreshing_items = this.time_to_refresh_items < 0;
        const chance_to_spawn_items = Math.min(0.2, 10 / (this.infection_count + 10));
        if (should_refreshing_items) this.time_to_refresh_items += 4;
        this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
            if (should_refreshing_items && Math.random() < chance_to_spawn_items && !field.object) {
                switch (field.terrain.type) {
                    case TerrainTypeID.INDOOR_TOILET:
                        this.create_object(Paperroll, new Point(field.x, field.y));
                        break;
                    case TerrainTypeID.INDOOR_TABLE:
                        this.create_object(Nudel, new Point(field.x, field.y));
                        break;
                    case TerrainTypeID.INDOOR_CLINICAL_PALLETTE:
                        this.create_object(Spray, new Point(field.x, field.y));
                        break;
                }
            }
            return field;
        });

        this.time_of_day += delta_seconds / 2;
        if (this.time_of_day >= 24) {
            this.day++;
            this.time_of_day -= 24;
            this.paper_kiled = false;
        }
        if (this.time_of_day >= 12 && !this.paper_kiled) {
            this.paper_kiled = true;
            this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
                if (field.terrain.variation_key === "with_paper") {
                    return Object.assign({}, field, {
                        terrain: {
                            type: field.terrain.type,
                            variation_key: "default",
                        }
                    });
                }
                return field;
            });
        }
        if (!this.has_won && this.objects.filter((object) => object instanceof Virus).length === 0) {
            this.has_won = true;
            this.current_level = (this.current_level + 1) % this.levels.length;
        }
        if (!this.has_lost && this.object.is_destroyed()) this.has_lost = true;
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
        const object_offset = this.object.moving_offset;
        this.visualizers.world_map.set_camera(this.camera_position.add(object_offset)).display(delta_seconds);
        const time_of_day_p = (this.time_of_day / 24);
        if (time_of_day_p < 0.25 || time_of_day_p > 0.75) {
            const time_of_night_p = ((time_of_day_p + 1 - 0.75) % 1) * 2;
            const strength = (time_of_day_p - 0.25) * (time_of_day_p - 0.75) * 4;
            this.context.fillStyle = "hsla(" + ((time_of_night_p * 0.25 + 0.5) * 365) % 356 + ", 90%, 10%, " + strength + ")";
            this.context.fillRect(0, 0, 20 * 32, 15 * 32);
        }

        this.visualizers.inventar.display(this.object);
        this.visualizers.hunger.display(this.object);

        this.context.fillStyle = "gray";
        //this.context.fillRect(650, 500, 150, 100);
        this.visualizers.daytime.display(this.time_of_day / 24, this.day);
        this.visualizers.life.display(this.object);
        this.visualizers.fps_counter(this.fps_counter.get_current_fps());
        this.visualizers.infection.display(this.infection_count);
    }

    draw_loose_screen() {
        this.context.font = '64px gothic';
        this.context.fillStyle = 'red';
        this.context.fillText('You died', 50, 50, 200);
        this.context.font = '48px fantasy';
        this.context.fillStyle = 'gold';
        this.context.fillText('Day ' + this.day, 150, 150, 200);
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
        this.input_delegator.game_over = true;
        return;
    }

    on_input_attack = () => {
        const inventar = this.object.components.get(InventarComponent);
        if (!inventar || inventar.has('spray') === false) return;

        let direction = this.object.look_direction;
        let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        let target_field = this.world_map.at(target_pos);
        if (target_field) {
            this.object.attack(target_field, DamageType.SPRAY);
        }
        if (target_field && target_field.object) {
            target_field.object.damage({
                type: DamageType.SPRAY,
                source: target_field.object,
                amount: 1,
            });
        }
    }

    on_input_direction = (direction: Direction): boolean => {
        let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        let target_field = this.world_map.at(target_pos);
        if (target_field) {
            if (this.object.moving_progress !== false) return false;
            this.object.move_to(this.world_map, target_pos);
            this.camera_position = this.object.get_position();
        }
        return true;
    }

    on_input_use_paper = () => {
        const field_pos = this.object.get_position();
        const inventar = this.object.components.get(InventarComponent);
        if (!inventar) return;
        const has = inventar.has('paperroll') || inventar.has('paperroll_half') || inventar.has('paperroll_last');
        if (!has) return;
        const old_field = this.world_map.at(field_pos);
        if (old_field && old_field.terrain.variation_key === 'default' &&
            (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
            if (inventar.has('paperroll_last')) {
                inventar.remove('paperroll_last');
            } else if (inventar.has('paperroll_half')) {
                inventar.remove('paperroll_half');
                inventar.items.push('paperroll_last')
            } else if (inventar.has('paperroll')) {
                inventar.remove('paperroll');
                inventar.items.push('paperroll_half')
            }
            this.world_map.update_field_at_point(field_pos, {
                terrain: {
                    type: old_field.terrain.type,
                    variation_key: 'with_paper',
                }
            });
        }
    }

    on_input_use_spray = () => {
        const field_pos = this.object.get_position();
        const inventar = this.object.components.get(InventarComponent);
        if (!inventar || inventar.has('spray') === false) return;

        const old_field = this.world_map.at(field_pos);
        if (inventar.items.length > 0 && old_field && old_field.terrain.variation_key === 'default' &&
            (old_field.terrain.type === TerrainTypeID.OUTDOOR_GRAS || old_field.terrain.type === TerrainTypeID.INDOOR_SHOP)) {
            inventar.remove('spray');
            this.world_map.update_field_at_point(field_pos, {
                terrain: {
                    type: old_field.terrain.type,
                    variation_key: 'with_spray',
                }
            });
        }
    }

    on_input_eat = () => {
        const inventar = this.object.components.get(InventarComponent);
        const hunger = this.object.components.get(HungerComponent);
        if (!inventar || inventar.has('nudel') === false) return;
        inventar.remove('nudel');
        if (!hunger) return;
        hunger.urge_to_eat = Math.max(0, hunger.urge_to_eat - 40);

    }

    public create_object(object_constructor: CreateableObjectTypes, pos: Point) {
        this.to_add_objects.push(new object_constructor(this.world_map, pos));
    }
}

type CreateableObjectTypes = typeof Spray | typeof Nudel | typeof Paperroll | typeof Virus;
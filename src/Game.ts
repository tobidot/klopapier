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
import { image_resources } from "./assets/ImageResources";
import Virus from "./logic/map/objects/Virus";
import InventarComponent from "./logic/map/objects/components/InventarComponent";
import MapObject from "./logic/map/objects/abstract/MapObject";
import Nudel from "./logic/map/objects/Nudel";
import Spray from "./logic/map/objects/Spray";
import HungerOnScreen from "./visualization/HungerOnScreen";
import HungerComponent from "./logic/map/objects/components/HungerComponent";
import LifeOnScreen from "./visualization/LifeOnScreen";
import { data } from "./logic/data/Map1";
import DayTimeOnScreen from "./visualization/DayTimeOnScreen";
import InfectedWalkingComponent from "./logic/map/objects/components/InfectedWalkingComponent";
import InfectedSpreadComponent from "./logic/map/objects/components/InfectedSpreadComponent";
import MapData from "./logic/data/MapData";

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

    public time_of_day: number = 0;
    public day: number = 0;
    public paper_kiled = false;

    private visualizers: {
        fps_counter: (print: number) => void,
        world_map: WorldMapOnScreen,
        inventar: InventarOnScreen,
        hunger: HungerOnScreen,
        life: LifeOnScreen,
        daytime: DayTimeOnScreen,
    };

    constructor(element: HTMLElement) {
        InfectedWalkingComponent.game = this;
        InfectedSpreadComponent.game = this;

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

        this.objects = [];
        this.world_map = this.construct_world_map();
        this.images = this.construct_image_manager();
        this.images.on_progress_listener.add(([progress, image]) => {
            this.context.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
            console.log(progress);
        });
        this.visualizers = {
            fps_counter: display_number_on_screen(this.context)(0, 0),
            world_map: WorldMapOnScreen.build()(this.context)(this.images)(this.world_map)(new Point(19, 14))(32),
            inventar: new InventarOnScreen(this.context, this.images, new Point(150, 500), new Point(2, 8)),
            hunger: new HungerOnScreen(this.context, this.images, Rect.from_boundries(0, 500, 650, 550)),
            life: new LifeOnScreen(this.context, this.images, Rect.from_boundries(0, 550, 650, 600)),
            daytime: new DayTimeOnScreen(this.context, this.images, Rect.from_boundries(650, 500, 800, 600)),
        };

        {
            this.object = new Agent(this.world_map.get_map_boundries().get_random_point().map(Math.floor));
            this.world_map.add_object(this.object);
            this.objects.push(this.object);
        }

        this.camera_position = this.object.get_position();
    }


    private construct_world_map(): WorldMap<TerrainTypeID> {
        const map_data: MapData = data;
        let field_generator: FieldGenerator<TerrainTypeID> = (map: WorldMap<TerrainTypeID>, x: number, y: number) => {
            const field_data = data.at(x, y);
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
        let map = WorldMap.factory()(map_data.width * 2, map_data.height * 2)(field_generator);
        return map;
    }

    private construct_image_manager(): ImageManager {
        return new ImageManager(image_resources);
    }

    async start() {
        await this.images.wait_until_loaded();

        setInterval(() => {
            this.fps_counter.update();
            this.update(1 / this.fps_counter.get_current_fps());
            this.draw(1 / this.fps_counter.get_current_fps());
        }, 1000.0 / 60.0);
    }

    update(delta_seconds: number) {
        if (this.object.is_destroyed()) return;
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
        this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
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

    }

    draw(delta_seconds: number) {
        this.context.clearRect(0, 0, 800, 600);
        if (this.object.is_destroyed()) {
            this.context.font = '64px gothic';
            this.context.fillStyle = 'red';
            this.context.fillText('You died', 50, 50, 200);
            this.context.font = '48px fantasy';
            this.context.fillStyle = 'gold';
            this.context.fillText('Day ' + this.day, 150, 150, 200);
            this.input_delegator.game_over = true;
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
        if (old_field && old_field.terrain.variation_key === 'default') {
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
        if (inventar.items.length > 0 && old_field && old_field.terrain.variation_key === 'default') {
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
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
import Agent from "./logic/map/objects/Player";
import InventarOnScreen from "./visualization/InventarOnScreen";
import Klopapier from "./logic/map/objects/Klopapier";
import { image_resources } from "./assets/ImageResources";
import Virus from "./logic/map/objects/Virus";
import InventarComponent from "./logic/map/objects/components/InventarComponent";

export default class Game {
    private context: CanvasRenderingContext2D;
    private images: ImageManager;
    private world_map: WorldMap<TerrainTypeID>;
    //private players: Array<Player>;
    private fps_counter: FpsCounter = new FpsCounter(60);
    private camera_position: Point;
    private input_delegator: InputDelegator;

    private object: MovingMapObject;

    private visualizers: {
        fps_counter: (print: number) => void,
        world_map: WorldMapOnScreen,
        inventar: InventarOnScreen,
    };

    constructor(element: HTMLElement) {
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
        this.input_delegator.on_use_input = this.on_input_use;

        this.world_map = this.construct_world_map();
        this.images = this.construct_image_manager();
        this.images.on_progress_listener.add(([progress, image]) => {
            this.context.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
            console.log(progress);
        });
        this.visualizers = {
            fps_counter: display_number_on_screen(this.context)(0, 0),
            world_map: WorldMapOnScreen.build()(this.context)(this.images)(this.world_map)(new Point(19, 14))(32),
            inventar: new InventarOnScreen(this.context, this.images, new Point(150, 600), new Point(2, 8)),
        };

        {
            this.object = new Agent(new Point(20, 19));
            this.world_map.add_object(this.object);
        }

        this.camera_position = this.object.get_position();
    }

    private construct_world_map(): WorldMap<TerrainTypeID> {
        let field_generator: FieldGenerator = (x: number, y: number) => {
            const possible_terrain = [
                TerrainTypeID.INDOOR_SHOP,
                TerrainTypeID.OUTDOOR_GRAS,
            ];
            const terrain: Terrain = {
                type: possible_terrain[randomBytes(1).readUInt8(0) % possible_terrain.length],
                variation_key: 'default',
            };
            return { x, y, object: null, terrain };
        };
        let map = WorldMap.factory()(32, 32)(field_generator);
        let object_count = randomBytes(1).readUInt8(0);

        for (let i = 0; i < object_count; ++i) {
            const possible_objects = [
                Klopapier,
                Virus,
            ];
            const constructor = possible_objects[randomBytes(1).readUInt8(0) % possible_objects.length];
            let x = randomBytes(1).readUInt8(0) % map.width;
            let y = randomBytes(1).readUInt8(0) % map.height;
            let object = new constructor(new Point(x, y));
            map.add_object(object);
        }

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
        this.world_map.map_fields_in_rect(this.world_map.get_map_boundries(), (field: Field) => {
            //field.object.update();
            return field;
        });
    }

    draw(delta_seconds: number) {
        this.context.clearRect(0, 0, 800, 600);
        this.visualizers.world_map.set_camera(this.camera_position).display(delta_seconds);
        this.visualizers.inventar.display(this.object);
        this.visualizers.fps_counter(this.fps_counter.get_current_fps());
    }

    on_input_attack = () => {
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

    on_input_direction = (direction: Direction) => {
        let target_pos = this.object.get_position().add(direction_to_point(direction, 1));
        let target_field = this.world_map.at(target_pos);
        if (target_field) {
            this.object.move_to(this.world_map, target_pos);
            this.camera_position = this.object.get_position();
        }
    }

    on_input_use = () => {
        const field_pos = this.object.get_position();
        const inventar = this.object.components.get(InventarComponent);
        if (inventar) {
            if (inventar.items.length > 0 && this.world_map.at(field_pos)?.terrain.type !== TerrainTypeID.OUTDOOR_KLOPAPIER) {
                inventar.items.shift();
                this.world_map.update_field_at_point(field_pos, {
                    terrain: {
                        type: TerrainTypeID.OUTDOOR_KLOPAPIER,
                        variation_key: 'default',
                    }
                });
            }
        }
    }
}
import WorldMap, { FieldGenerator } from "../logic/map/WorldMap";
import { TerrainTypeID } from "../assets/TerrainResources";
import { Rect, Point, RectSize } from "../ts_library/space/SimpleShapes";
import Field from "../logic/map/Field";
import { ImageID, image_resources } from "../assets/ImageResources";
import ImageManager from "../manager/ImageManager";
import Terrain from "../logic/map/Terrain";
import MapObject from "../logic/map/objects/abstract/MapObject";
import { MapObjectTypeID } from "../assets/MapObjectResources";
import MovingMapObject from "../logic/map/objects/abstract/MovingMapObject";
import LivingMapObject from "../logic/map/objects/abstract/LivingMapObject";
import { ObjectDestroyedEvent, ObjectAttacksEvent, ObjectDamagedEvent } from "../logic/map/Events";
import { DamageType } from "../logic/fight/DamageType";

function assert_class_type<BASE, DERIVE extends BASE>(object: BASE, class_arg: { new(...x: any): DERIVE, name: string }): object is DERIVE {
    if (object instanceof class_arg === false) {
        throw new Error("Object should be of type " + class_arg.name);
        return false;
    }
    return true;
};

function get_image_for_terrain_type(terrain: Terrain): ImageID | null {
    switch (terrain.type) {
        case TerrainTypeID.INDOOR_SHOP:
            return ImageID.TERRAIN__INDOOR_SHOP;
        case TerrainTypeID.OUTDOOR_GRAS:
            return ImageID.TERRAIN__OUTDOOR_GRAS;
        default:
            return null;
    }
}

function get_image_for_object_type(object: MapObject | null): ImageID | null {
    if (!object) return null;
    switch (object.type) {
        case MapObjectTypeID.KLOPAPIER:
            return ImageID.OBJECT__KLOPAPIER;
        case MapObjectTypeID.VIRUS:
            return ImageID.UNIT__VIRUS;
        case MapObjectTypeID.PLAYER:
            if (assert_class_type(object, MovingMapObject)) {
                return [ImageID.UNIT__SMILEY_LEFT, ImageID.UNIT__SMILEY_UP, ImageID.UNIT__SMILEY_RIGHT, ImageID.UNIT__SMILEY_DOWN][object.look_direction];
            }
        default:
            console.error('No Image found for Object ' + object.type);
            return null;
    }
}

export default class WorldMapOnScreen {
    private context: CanvasRenderingContext2D;
    private image_manager: ImageManager;
    private screen_size: RectSize;
    private camera: Point;
    private field_drawer: FieldDrawer;
    private world_map: WorldMap<TerrainTypeID>;
    private effects: Array<Effect>;

    private constructor(
        context: CanvasRenderingContext2D,
        image_manager: ImageManager,
        world_map: WorldMap<TerrainTypeID>) {
        this.context = context;
        this.image_manager = image_manager;
        this.world_map = world_map;
        this.effects = new Array<Effect>();
        this.field_drawer = (new FieldDrawer(this.context, this.image_manager, this.effects));
        this.field_drawer.screen_size = this.screen_size = new Point(19, 14);
        this.field_drawer.camera = this.camera = new Point(0, 0);
        context.imageSmoothingEnabled = false;
        this.world_map.events.on_destroy.add((event: ObjectDestroyedEvent) => {
            const object = event.destroyed;
            if (object instanceof LivingMapObject) {
                const object_image_id = get_image_for_object_type(object);
                if (object && object_image_id) {
                    this.effects.push(new Effect(object.get_position(), object_image_id));
                };
            }
        });
        this.world_map.events.on_attack.add((event: ObjectAttacksEvent) => {
            const field = event.target;
            switch (event.attack_type) {
                case DamageType.SPRAY:
                    this.effects.push(new Effect(new Point(field.x, field.y), ImageID.EFFECT__SPRAY, 0.5, 0.1));
                    break;
                case DamageType.INFECT:
                    this.effects.push(new Effect(new Point(field.x, field.y), ImageID.EFFECT__INFECT, 0.5, 0.1));
                    break;
                default:
                    console.error('Unkown attack type');
                    this.effects.push(new Effect(new Point(field.x, field.y), ImageID.EFFECT__INFECT, 0.5, 0.1));
                    break;
            }
        });
    }

    public display(delta_seconds: number) {
        this.field_drawer.effects = this.effects;
        let draw_field = this.field_drawer.get_draw_function();
        const view_rect = Rect.from_boundries(0, 0, this.screen_size.x, this.screen_size.y)
            .move_by(-Math.round(this.screen_size.x / 2), - Math.round(this.screen_size.y / 2))
            .move_by(this.camera.x, this.camera.y);
        this.world_map.map_fields_in_rect(view_rect, draw_field);
        this.effects = this.effects.filter((effect) => {
            effect.update(delta_seconds);
            return effect.is_allive();
        });
    }

    public set_camera(position: Point): this {
        this.field_drawer.camera = this.camera = position;
        return this;
    }

    public set_screen_size(position: Point): this {
        this.camera = position;
        return this;
    }

    public static build() {
        return (context: CanvasRenderingContext2D) => (image_manager: ImageManager) => (world_map: WorldMap<TerrainTypeID>) =>
            (screen_size: RectSize) => (cell_size: number) => {
                let worldmap_screener = new WorldMapOnScreen(context, image_manager, world_map);
                worldmap_screener.set_screen_size(screen_size);
                worldmap_screener.field_drawer.cell_size = cell_size;
                return worldmap_screener;
            }
    }
}

class FieldDrawer {
    public image_manager: ImageManager;
    public context: CanvasRenderingContext2D;
    public cell_size: number;
    public camera: Point;
    public screen_size: RectSize;
    public effects: Array<Effect>;

    constructor(
        context: CanvasRenderingContext2D,
        image_manager: ImageManager,
        effects: Array<Effect>) {
        this.context = context;
        this.image_manager = image_manager;
        this.effects = effects;
        this.cell_size = 16;
        this.screen_size = new Point(19, 14);
        this.camera = new Point(0, 0);
    }

    private draw_terrain(image_x: number, image_y: number, field: Field) {
        let terrain_image_id = get_image_for_terrain_type(field.terrain);
        if (terrain_image_id !== null) {
            let terrain_image = this.image_manager.get(terrain_image_id);
            this.context.drawImage(terrain_image, image_x, image_y, this.cell_size, this.cell_size);
        }
    }

    private draw_object(image_x: number, image_y: number, field: Field) {
        let object_image_id = get_image_for_object_type(field.object);
        if (object_image_id !== null) {
            let object_image = this.image_manager.get(object_image_id);
            this.context.drawImage(object_image, image_x, image_y, this.cell_size, this.cell_size);
        }
    };

    private draw_effects(image_x: number, image_y: number, field_pos: Point) {
        this.effects.forEach((effect) => {
            const image_id = effect.get_image_to_display(field_pos);
            if (image_id !== null) {
                let image = this.image_manager.get(image_id);
                this.context.drawImage(image, image_x, image_y, this.cell_size, this.cell_size);
            }
        });
    };

    public get_draw_function() {
        const half_screen_width = Math.round(this.screen_size.x / 2);
        const half_screen_height = Math.round(this.screen_size.y / 2);
        return (field: Field): Field => {
            let image_x = (field.x - this.camera.x + half_screen_width) * this.cell_size;
            let image_y = (field.y - this.camera.y + half_screen_height) * this.cell_size;

            this.draw_terrain(image_x, image_y, field);
            this.draw_object(image_x, image_y, field);
            this.draw_effects(image_x, image_y, new Point(field.x, field.y));
            return field;
        };
    }
}

class Effect {
    private position: Point;
    private time_to_live: number;
    private age: number;
    private blink_interval: number;
    private image_id: ImageID;

    constructor(position: Point, image_id: ImageID, time_to_live: number = 2, blink_interval: number = 0.25) {
        this.position = position;
        this.image_id = image_id;
        this.time_to_live = time_to_live;
        this.blink_interval = blink_interval;
        this.age = 0;
    }

    public update(dt: number) {
        this.age += dt;
    }

    public is_allive() {
        return this.age < this.time_to_live;
    }

    public get_image_to_display(position: Point): ImageID | null {
        if (!position.equals(this.position)) return null;
        if (Math.trunc(this.age / this.blink_interval) % 2 === 1) return null;
        return this.image_id;
    }
}
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
import { direction_to_point } from "../ts_library/conversion/fromDirection";

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
            switch (terrain.variation_key) {
                case 'with_paper': return ImageID.TERRAIN__INDOOR_SHOP_WITH_PAPER;
                case 'with_spray': return ImageID.TERRAIN__INDOOR_SHOP_WITH_SPRAY;
                default: return ImageID.TERRAIN__INDOOR_SHOP;
            }
        case TerrainTypeID.OUTDOOR_GRAS:
            switch (terrain.variation_key) {
                case 'with_paper': return ImageID.TERRAIN__OUTDOOR_GRAS_WITH_PAPER;
                case 'with_spray': return ImageID.TERRAIN__OUTDOOR_GRAS_WITH_SPRAY;
                default: return ImageID.TERRAIN__OUTDOOR_GRAS;
            }
        case TerrainTypeID.INDOOR_PALLETTE: return ImageID.TERRAIN__INDOOR_EMPTY_PALLETTE;
        case TerrainTypeID.INDOOR_TOILET: return ImageID.TERRAIN__INDOOR_TOILET;
        case TerrainTypeID.INDOOR_CLINICAL_PALLETTE: return ImageID.TERRAIN__INDOOR_EMPTY_CLINICAL_PALLETTE;
        case TerrainTypeID.INDOOR_TABLE: return ImageID.TERRAIN__INDOOR_TABLE;
        default:
            return null;
    }
}

function get_image_for_object_type(object: MapObject | null): ImageID | null {
    if (!object) return null;
    switch (object.type) {
        case MapObjectTypeID.PAPER_ROLL:
            return ImageID.OBJECT__PAPER_ROLL;
        case MapObjectTypeID.NUDEL:
            return ImageID.OBJECT__NUDEL4;
        case MapObjectTypeID.SPRAY:
            return ImageID.OBJECT__SPRAY;
        case MapObjectTypeID.WALL:
            return ImageID.OBJECT__WALL2;
        case MapObjectTypeID.FURNITURE1:
            return ImageID.OBJECT__FURNITURE1;
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
        this.world_map.events.on_effect.add((event: Field) => {
            this.effects.push(new Effect(new Point(event.x, event.y), ImageID.EFFECT__FIRE, 2));
        });

    }

    public display(delta_seconds: number) {
        this.field_drawer.effects = this.effects;
        let draw_terrain_field = this.field_drawer.get_draw_terrain_function();
        let draw_object_field = this.field_drawer.get_draw_object_function();
        let draw_effect_field = this.field_drawer.get_draw_effect_function();
        const view_rect = Rect.from_boundries(0, 0, this.screen_size.x, this.screen_size.y)
            .move_by(-Math.round(this.screen_size.x / 2), - Math.round(this.screen_size.y / 2))
            .move_by(Math.floor(this.camera.x), Math.floor(this.camera.y));
        this.world_map.map_fields_in_rect(view_rect, draw_terrain_field);
        this.world_map.map_fields_in_rect(view_rect, draw_object_field);
        this.world_map.map_fields_in_rect(view_rect, draw_effect_field);
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

    private draw_terrain = (image_x: number, image_y: number, field: Field) => {
        let terrain_image_id = get_image_for_terrain_type(field.terrain);
        if (terrain_image_id !== null) {
            let terrain_image = this.image_manager.get(terrain_image_id);
            this.context.drawImage(terrain_image, image_x, image_y, this.cell_size, this.cell_size);
        }
    }

    private draw_object = (image_x: number, image_y: number, field: Field) => {
        let object_image_id = get_image_for_object_type(field.object);
        if (object_image_id !== null) {
            let object_image = this.image_manager.get(object_image_id);
            if (field.object instanceof MovingMapObject && field.object.moving_progress !== false) {
                const offset: Point = direction_to_point(field.object.comming_from_direction, field.object.moving_progress);
                image_x += offset.x * this.cell_size;
                image_y += offset.y * this.cell_size;
            }
            this.context.drawImage(object_image, image_x, image_y, this.cell_size, this.cell_size);
        }
    };

    private draw_effects = (image_x: number, image_y: number, field: Field) => {
        this.effects.forEach((effect) => {
            const image_id = effect.get_image_to_display(new Point(field.x, field.y));
            if (image_id !== null) {
                let image = this.image_manager.get(image_id);
                this.context.drawImage(image, image_x, image_y, this.cell_size, this.cell_size);
            }
        });
    };

    private get_draw_function(callback: (x: number, y: number, field: Field) => void) {
        const half_screen_width = Math.round(this.screen_size.x / 2);
        const half_screen_height = Math.round(this.screen_size.y / 2);
        return (field: Field): Field => {
            let image_x = (field.x - this.camera.x + half_screen_width) * this.cell_size;
            let image_y = (field.y - this.camera.y + half_screen_height) * this.cell_size;
            callback(image_x, image_y, field);
            return field;
        };
    }

    public get_draw_terrain_function() {
        return this.get_draw_function(this.draw_terrain);
    }

    public get_draw_object_function() {
        return this.get_draw_function(this.draw_object);
    }

    public get_draw_effect_function() {
        return this.get_draw_function(this.draw_effects);
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
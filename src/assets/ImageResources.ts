export enum ImageID {
    TERRAIN_GRAS,
    TERRAIN_DIRT,
    TERRAIN_STONE,
    TERRAIN_WALL,
    TERRAIN_WATER,

    OBJECTS_FLOWERS,
    OBJECTS_TREE,
    OBJECTS_WOODEN_BOX,
    OBJECTS_WOODEN_BOX__OPEN,
    OBJECTS_FIRE,
    OBJECTS_VASE,

    EFFECT_SLASH,
    EFFECT_BLUNT,
    EFFECT_ICE,
    EFFECT_FIRE,

    PLAYER_A,
    PLAYER_A_LEFT,
    PLAYER_A_UP,
    PLAYER_A_RIGHT,
    PLAYER_A_DOWN,


    MONSTER_BLOB,
    MONSTER_SNAKE,

    MAX,
};

export var image_resources: { [key: string]: string } = (() => {
    const images: {
        terrain: { [key: string]: string },
        effects: { [key: string]: string },
        environment: { [key: string]: string },
        objects: { [key: string]: string },
        units: { [key: string]: string },
    } = require('F:\\assets/own/bit-graphic/sheme_grim/**/*.png');
    return {
        //[ImageID.TEST]: require('F:\\assets/own/bit-graphic/test/test.png'),
        [ImageID.TERRAIN_DIRT]: images.terrain.dirt,
        [ImageID.TERRAIN_GRAS]: images.terrain.gras,
        [ImageID.TERRAIN_STONE]: images.terrain.stone,
        [ImageID.TERRAIN_WALL]: images.terrain.wall,
        [ImageID.TERRAIN_WATER]: images.terrain.water,

        [ImageID.OBJECTS_FLOWERS]: images.environment.flowers,
        [ImageID.OBJECTS_TREE]: images.environment.tree,
        [ImageID.OBJECTS_FIRE]: images.environment.fire,
        [ImageID.OBJECTS_WOODEN_BOX]: images.objects.treasure_box,
        [ImageID.OBJECTS_WOODEN_BOX__OPEN]: images.objects.treasure_box_open,
        [ImageID.OBJECTS_VASE]: images.objects.vase_with_sign,

        [ImageID.EFFECT_SLASH]: images.effects.slash,
        [ImageID.EFFECT_BLUNT]: images.effects.blow,
        [ImageID.EFFECT_FIRE]: images.effects.fire,
        [ImageID.EFFECT_ICE]: images.effects.ice,

        [ImageID.PLAYER_A]: images.units.guy_a,
        [ImageID.PLAYER_A_LEFT]: images.units.guy_a_left,
        [ImageID.PLAYER_A_UP]: images.units.guy_a_up,
        [ImageID.PLAYER_A_RIGHT]: images.units.guy_a_right,
        [ImageID.PLAYER_A_DOWN]: images.units.guy_a_down,

        [ImageID.MONSTER_SNAKE]: images.units.snake,
        [ImageID.MONSTER_BLOB]: images.units.blob,
    };
})();

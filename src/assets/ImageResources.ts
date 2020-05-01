export enum ImageID {
    TERRAIN__INDOOR_SHOP,
    TERRAIN__OUTDOOR_GRAS,
    TERRAIN__OUTDOOR_PATH_DIRT,
    TERRAIN__OUTDOOR_PATH_ROAD,
    TERRAIN__INDOOR_SHOP_WITH_PAPER,
    TERRAIN__OUTDOOR_GRAS_WITH_PAPER,
    TERRAIN__OUTDOOR_PATH_DIRT_WITH_PAPER,
    TERRAIN__OUTDOOR_PATH_ROAD_WITH_PAPER,
    TERRAIN__INDOOR_SHOP_WITH_SPRAY,
    TERRAIN__OUTDOOR_GRAS_WITH_SPRAY,
    TERRAIN__OUTDOOR_PATH_DIRT_WITH_SPRAY,
    TERRAIN__OUTDOOR_PATH_ROAD_WITH_SPRAY,

    TERRAIN__INDOOR_TOILET,
    TERRAIN__INDOOR_EMPTY_PALLETTE,
    TERRAIN__INDOOR_EMPTY_CLINICAL_PALLETTE,
    TERRAIN__INDOOR_TABLE,

    OBJECT__PAPER_ROLL,
    OBJECT__PAPER_ROLL_HALF,
    OBJECT__PAPER_ROLL_LAST,
    OBJECT__SINGLE_PAPER,
    OBJECT__SPRAY,
    OBJECT__SPRAYED,
    OBJECT__WALL2,
    OBJECT__FURNITURE1,
    OBJECT__NUDEL4,

    OBJECT__MOON,
    OBJECT__SUN,

    EFFECT__INFECT,
    EFFECT__FIRE,
    EFFECT__SPRAY,

    UNIT__SMILEY_LEFT,
    UNIT__SMILEY_UP,
    UNIT__SMILEY_RIGHT,
    UNIT__SMILEY_DOWN,

    UNIT__VIRUS,

    MAPS__MAP1,
    MAPS__MAP2,
    MAPS__MAP3,
    MAPS__MAP4,
    MAPS__MAP5,
    MAPS__MAP6,
    MAPS__MAP7,
    MAPS__MAP8,
    MAPS__MAP9,

    TUTORIAL__LEVEL1,
    TUTORIAL__LEVEL2,
    TUTORIAL__LEVEL3,
    TUTORIAL__LEVEL4,
    TUTORIAL__LEVEL5,
    TUTORIAL__LEVEL6,
    TUTORIAL__LEVEL7,
    TUTORIAL__LEVEL8,
    TUTORIAL__LEVEL9,
    OTHER__ERROR,
};

export var image_resources: { [key: string]: string } = (() => {
    const images: {
        terrain: { [key: string]: string },
        effects: { [key: string]: string },
        environment: { [key: string]: string },
        objects: { [key: string]: string },
        units: { [key: string]: string },
    } = require('./images/**/*.png');
    let result: { [key: string]: string } = {};
    Object.keys(ImageID).filter(k => typeof ImageID[k as any] === "number").forEach(name => {
        const path_parts = name.toLowerCase().split('__');
        let path: any = images;
        while (path_parts.length > 0) {
            const path_part = path_parts.shift();
            if (path_part === undefined || path_part in path === false) throw new Error("Image not found " + name);
            path = path[path_part];
        }
        result[ImageID[name as any]] = path;
    });
    return result;
})();

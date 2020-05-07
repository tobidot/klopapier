import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";
import IsCollectableComponent from "../components/IsCollectableComponent";


export default class Nudel extends MapObject {
    constructor() {
        super(MapObjectTypeID.NUDEL);

        const position = new PositionComponent();
        position.collision_group = CollisionGroups.COLLECTABLE;
        position.collision_mask = CollisionGroups.GHOST;
        this.add(position);

        const visual = new VisualComponent();
        visual.image = visual.icon = ImageID.OBJECT__NUDEL4;
        this.add(visual);

        const charges = new ChargesComponent();
        charges.charges_left = 1;
        this.add(charges);

        const is_collectable = new IsCollectableComponent();
        this.add(is_collectable);
    }
}
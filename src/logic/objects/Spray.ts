import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import IsCollectableComponent from "../components/IsCollectableComponent";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";
import ChargesComponent from "../components/ChargesComponent";
import IsSprayComponent from "../components/IsSprayComponent";

export default class Spray extends MapObject {
    constructor() {
        super(MapObjectTypeID.SPRAY);


        const spray = new IsSprayComponent();
        this.add(spray);


        const position = new PositionComponent();
        position.collision_group = CollisionGroups.COLLECTABLE;
        position.collision_mask = CollisionGroups.UNPASSABLE;
        this.add(position);

        const is_collectable = new IsCollectableComponent();
        this.add(is_collectable);

        const charges = new ChargesComponent();
        charges.charges_left = 1;
        this.add(charges);

        const visual = new VisualComponent();
        visual.image = ImageID.OBJECT__SPRAY;
        visual.icon = ImageID.OBJECT__SPRAY;
        this.add(visual);
    }
}
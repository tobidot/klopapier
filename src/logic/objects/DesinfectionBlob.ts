import MapObject from "./MapObject";
import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";
import DamageOtherObjectsComponent from "../components/DamageOtherObjectsComponent";
import IsSprayComponent from "../components/IsSprayComponent";

export default class DesinfectionBlob extends MapObject {
    constructor() {
        super(MapObjectTypeID.SPRAY_BLOB);

        const spray = new IsSprayComponent();
        this.add(spray);

        const position = new PositionComponent();
        position.collision_group = CollisionGroups.GHOST;
        this.add(position);

        const visual = new VisualComponent();
        visual.icon = ImageID.OBJECT__SPRAYED;
        visual.image = ImageID.OBJECT__SPRAYED;
        visual.priority = -1000;
        this.add(visual);

        //const desinfect = new DamageOtherObjectsComponent
    }
}
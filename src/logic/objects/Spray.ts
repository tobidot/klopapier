import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";

export default class Spray extends MapObject {
    constructor() {
        super(MapObjectTypeID.SPRAY);
        const position = new PositionComponent();
        position.collision_group = CollisionGroups.COLLECTABLE;
        position.collision_mask = CollisionGroups.UNPASSABLE;
        this.add(position);
    }
}
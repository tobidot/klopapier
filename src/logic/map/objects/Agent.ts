import { MapObjectTypeID } from "../../../assets/MapObjectResources";
import InventarComponent from "./components/InventarComponent";
import { Point } from "../../../ts_library/space/SimpleShapes";
import HungerComponent from "./components/HungerComponent";
import { PositionComponent } from "./components/PositionComponent";
import MapObject from "./abstract/MapObject";
import FollowWithCameraComponent from "./components/FollowWithCameraComponent";
import PlayerControlledComponent from "./components/PlayerControlled";


export default class Agent extends MapObject {
    constructor() {
        super(MapObjectTypeID.PLAYER);
        this.add(new InventarComponent(this));
        this.add(new HungerComponent(this));
        this.add(new PositionComponent());
        this.add(new FollowWithCameraComponent());
        this.add(new PlayerControlledComponent());
    }
}
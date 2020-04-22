import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import InventarComponent from "../components/InventarComponent"; import HungerComponent from "../components/HungerComponent"; import PlayerControlledComponent from "../components/PlayerControlled"; import { PositionComponent } from "../components/PositionComponent"; import FollowWithCameraComponent from "../components/FollowWithCameraComponent";


export default class Agent extends MapObject {
    constructor() {
        super(MapObjectTypeID.PLAYER);
        this.add(new InventarComponent(this));
        this.add(new HungerComponent(this));

        this.add(new PlayerControlledComponent());
        this.add(new PositionComponent());
        this.add(new FollowWithCameraComponent());
    }
}
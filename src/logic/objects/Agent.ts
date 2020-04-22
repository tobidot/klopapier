import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import InventarComponent from "../components/InventarComponent"; import HungerComponent from "../components/HungerComponent"; import PlayerControlledComponent from "../components/PlayerControlled"; import { PositionComponent, CollisionGroups } from "../components/PositionComponent"; import FollowWithCameraComponent from "../components/FollowWithCameraComponent";


export default class Agent extends MapObject {
    constructor() {
        super(MapObjectTypeID.PLAYER);
        let position = new PositionComponent();
        position.collision_group = CollisionGroups.MOVEABLE;
        position.collision_mask = CollisionGroups.MOVEABLE | CollisionGroups.INTERACTABLE;

        this.add(new InventarComponent(this));
        this.add(new HungerComponent(this));

        this.add(new PlayerControlledComponent());

        this.add(position);
        this.add(new FollowWithCameraComponent());
    }
}
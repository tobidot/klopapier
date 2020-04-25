import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import InventarComponent from "../components/InventarComponent"; import HungerComponent from "../components/HungerComponent"; import PlayerControlledComponent from "../components/PlayerControlled"; import { PositionComponent, CollisionGroups } from "../components/PositionComponent"; import FollowWithCameraComponent from "../components/FollowWithCameraComponent";
import HitPointsComponent from "../components/HitPointsComponent";


export default class Agent extends MapObject {
    constructor() {
        super(MapObjectTypeID.PLAYER);
        let position = new PositionComponent();
        position.collision_group = CollisionGroups.MOVEABLE;
        position.collision_mask = CollisionGroups.MOVEABLE | CollisionGroups.INTERACTABLE;

        this.add(new InventarComponent());
        this.add(new HungerComponent(this));

        let hitpoints = new HitPointsComponent();
        hitpoints.current = hitpoints.max = 10;
        this.add(hitpoints);

        this.add(new PlayerControlledComponent());

        this.add(position);
        this.add(new FollowWithCameraComponent());
    }
}
import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import InventarComponent from "../components/InventarComponent"; import HungerComponent from "../components/HungerComponent"; import PlayerControlledComponent from "../components/PlayerControlled"; import { PositionComponent, CollisionGroups } from "../components/PositionComponent"; import FollowWithCameraComponent from "../components/FollowWithCameraComponent";
import HitPointsComponent from "../components/HitPointsComponent";
import IsHumanComponent from "../components/IsHumanComponent";
import MovingComponent from "../components/MovingComponent";
import SpawnItemsComponent from "../components/SpawnItemsComponent";
import Spray from "./Spray";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";


export default class ClinicalPalette extends MapObject {
    constructor() {
        super(MapObjectTypeID.CLINICAL_PALLETTE);
        let position = new PositionComponent();
        position.collision_group = CollisionGroups.INTERACTABLE;
        position.collision_mask = CollisionGroups.UNPASSABLE;
        this.add(position);

        let spawn_items = new SpawnItemsComponent();
        spawn_items.type = () => new Spray;
        spawn_items.interval_in_seconds = 2;
        this.add(spawn_items);

        let visual = new VisualComponent();
        visual.image = ImageID.TERRAIN__INDOOR_EMPTY_CLINICAL_PALLETTE;
        visual.priority = -200;
        this.add(visual);
    }
}
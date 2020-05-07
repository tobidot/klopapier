import MapObject from "./MapObject";
import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";
import IsPaperComponent from "../components/IsPaperComponent";

export default class PaperBlob extends MapObject {
    constructor() {
        super(MapObjectTypeID.PAPER_BLOB);

        const position = new PositionComponent();
        position.collision_group = CollisionGroups.INTERACTABLE;
        position.collision_mask = CollisionGroups.INTERACTABLE;
        this.add(position);

        let visual = new VisualComponent();
        visual.icon = visual.image = ImageID.OBJECT__SINGLE_PAPER;
        visual.priority = -5;
        this.add(visual);

        let is_paper = new IsPaperComponent();
        this.add(is_paper);
    }
}
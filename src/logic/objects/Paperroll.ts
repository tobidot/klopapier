import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent, CollisionGroups } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";
import IsPaperComponent from "../components/IsPaperComponent";
import VisualComponent from "../components/VisualComponent";
import { ImageID } from "../../assets/ImageResources";
import IsCollectableComponent from "../components/IsCollectableComponent";


export default class Paperroll extends MapObject {
    constructor() {
        super(MapObjectTypeID.PAPER_ROLL);

        const paper = new IsPaperComponent();
        this.add(paper);

        const position = new PositionComponent();
        position.collision_group = CollisionGroups.COLLECTABLE;
        position.collision_mask = CollisionGroups.GHOST;
        this.add(position);

        const visual = new VisualComponent();
        visual.image = visual.icon = ImageID.OBJECT__PAPER_ROLL;
        this.add(visual);

        const charges = new ChargesComponent();
        charges.charges_left = 3;
        this.add(charges);


        const is_collectable = new IsCollectableComponent();
        this.add(is_collectable);
    }
}
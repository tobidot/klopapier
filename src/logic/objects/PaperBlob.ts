import MapObject from "./MapObject";
import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";

export default class PaperBlob extends MapObject {
    constructor() {
        super(MapObjectTypeID.PAPER_BLOB);
        const position = new PositionComponent();
        this.add(position);
    }
}
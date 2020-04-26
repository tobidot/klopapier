import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";
import IsPaperComponent from "../components/IsPaperComponent";


export default class Paperroll extends MapObject {
    constructor() {
        super(MapObjectTypeID.PAPER_ROLL);

        const paper = new IsPaperComponent();
        this.add(paper);

        const position = new PositionComponent();
        this.add(position);

        const charges = new ChargesComponent();
        charges.charges_left = 3;
        this.add(charges);
    }
}
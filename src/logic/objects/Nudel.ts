import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";
import { PositionComponent } from "../components/PositionComponent";
import ChargesComponent from "../components/ChargesComponent";


export default class Nudel extends MapObject {
    constructor() {
        super(MapObjectTypeID.NUDEL);

        // const spray = new IsSprayComponent();
        // this.add(spray);

        const position = new PositionComponent();
        this.add(position);

        const charges = new ChargesComponent();
        charges.charges_left = 1;
        this.add(charges);
    }
}
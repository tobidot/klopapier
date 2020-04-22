import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";


export default class Paperroll extends MapObject {
    constructor() {
        super(MapObjectTypeID.PAPER_ROLL);
    }
}
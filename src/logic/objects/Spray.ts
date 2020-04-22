import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources";

export default class Spray extends MapObject {
    constructor() {
        super(MapObjectTypeID.SPRAY);
    }
}
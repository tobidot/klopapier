import MapObject from "./MapObject"; import { MapObjectTypeID } from "../../assets/MapObjectResources"; import { PositionComponent } from "../components/PositionComponent";


export default class Wall extends MapObject {
    constructor() {
        super(MapObjectTypeID.WALL);
    }
}
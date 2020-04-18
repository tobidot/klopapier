import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";

export default class DieOnSprayComponent extends MapObjectComponent {
    public static NAME = "die_on_spray";

    public constructor(object: MapObject) {
        super(DieOnSprayComponent.NAME);
    }
}
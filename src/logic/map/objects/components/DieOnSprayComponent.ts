import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import CollectableMapObject from "../abstract/CollectableMapObject";
import Field from "../../Field";

export default class DieOnSprayComponent extends MapObjectComponent {
    public static NAME = "die_on_spray";

    public constructor(object: MapObject) {
        super(DieOnSprayComponent.NAME);
        object.on_position_change.add((event: { new: Field }) => {
            if (event.new.terrain.variation_key === 'with_spray') {
                object.destroy();
            }
        });
    }
}
import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import CollectableMapObject from "../abstract/CollectableMapObject";

export default class InventarComponent extends MapObjectComponent {
    public static NAME = "inventar";
    public money: number = 0;
    public items: Array<string> = [];

    public constructor(object: MapObject) {
        super(InventarComponent.NAME);
        object.on_position_change.add((event: { new: { object: any; }; }) => {
            const object = event.new.object;
            if (object instanceof CollectableMapObject) {
                if (typeof object.collectable === 'number') {
                    this.money += object.collectable;
                } else {
                    this.items.push(object.collectable);
                }
            }
        });
    }
}
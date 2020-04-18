import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";

export default class InventarComponent extends MapObjectComponent {
    public static NAME = "inventar";
    public money: number = 0;
    public items: Array<string> = [];
    public size: number = 12;
    public holding: MapObject | null = null;

    public constructor(object: MapObject) {
        super(InventarComponent.NAME);
        // object.on_position_change.add((event) => {
        //     // if (this.holding) {
        //     //     event.old.object = this.holding;
        //     //     this.holding = null;
        //     // }
        // });
    }

    public has(item: string) {
        return this.items.includes(item);
    }

    public remove(item: string) {
        let found = false;
        this.items = this.items.filter((current) => {
            if (!found && current === item) {
                found = true;
                return false;
            }
            return true;
        });
    }
}
import MapObjectComponent from "./MapObjectComponent";
import MapObject from "../abstract/MapObject";
import { DamageType } from "../../../fight/DamageType";

export default class HungerComponent extends MapObjectComponent {
    public static NAME = "hunger";
    public urge_to_eat: number = 0;
    public object: MapObject;
    public last_damage_tick: number = 0;

    public constructor(object: MapObject) {
        super(HungerComponent.NAME);
        this.object = object;
    }

    public update(seconds: number) {
        this.urge_to_eat = Math.min(this.urge_to_eat + seconds * 2, 100);
        if (this.urge_to_eat >= 100) {
            this.object.damage({
                amount: seconds,
                source: this.object,
                type: DamageType.TRUE,
            });
        } else {
            this.object.regen(seconds * 0.1);
        }
    }
}
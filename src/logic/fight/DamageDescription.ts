import { DamageType } from "./DamageType";
import MapObject from "../map/objects/abstract/MapObject";

export default interface DamageDescription {
    source: MapObject | null
    amount: number,
    type: DamageType,
}
import MapObject from "./objects/abstract/MapObject";
import DamageDescription from "../fight/DamageDescription";
import Field from "./Field";
import { DamageType } from "../fight/DamageType";

export interface ObjectDestroyedEvent {
    destroyed: MapObject;
}

export interface ObjectTouchedEvent {
    actor: MapObject;
    target: MapObject;
}

export interface ObjectTouchesEvent {
    actor: MapObject;
    target: Field;
}

export interface ObjectAttacksEvent {
    attacker: MapObject;
    target: Field;
    attack_type: DamageType;
}

export interface ObjectDamagedEvent {
    victim: MapObject;
    damage: DamageDescription;
} 
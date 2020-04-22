import MapObject from "../objects/MapObject"; import Field from "./Field";


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

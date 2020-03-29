import { ListenerSocket } from "./Listener";

export interface Interactive<T> {
    input_listeners: ListenerSocket<T>;
    change_listeners: ListenerSocket<T>;
}
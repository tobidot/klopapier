export interface Listener<T> {
    (new_value: T): void;
}

export class ListenerSocket<T> {
    private listeners: Array<Listener<T>> = [];
    public add(listener: Listener<T>): void {
        this.listeners.push(listener);
    }
    public remove(listener: Listener<T>): void {
        const index: number = this.listeners.indexOf(listener);
        if (index < 0) return;
        const length = this.listeners.length;
        this.listeners[index] = this.listeners[length - 1];
        this.listeners.pop();
    }
    public trigger_event(value: T) {
        this.listeners.forEach((listener: Listener<T>) => {
            listener(value);
        });
    }
}

export class ValueChangeListenerSocket<T> extends ListenerSocket<{ old: T, new: T }> {

};
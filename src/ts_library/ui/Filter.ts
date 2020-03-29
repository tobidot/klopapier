export interface Filter<T, R> {
    (result: R, new_value: T): R;
}

export class FilterSocket<T, R> {
    private initial_result: R;
    private listeners: Array<Filter<T, R>> = [];
    public constructor(initial_result: R) {
        this.initial_result = initial_result;
    }
    public add(listener: Filter<T, R>): void {
        this.listeners.push(listener);
    }
    public remove(listener: Filter<T, R>): void {
        const index: number = this.listeners.indexOf(listener);
        if (index < 0) return;
        const length = this.listeners.length;
        this.listeners[index] = this.listeners[length - 1];
        this.listeners.pop();
    }
    public trigger_event(value: T, initial: R = this.initial_result): R {
        return this.listeners.reduce((result: R, listener: Filter<T, R>) => {
            return listener(result, value);
        }, this.initial_result);
    }
}


export class ValueChangeFilterSocket<T> extends FilterSocket<{ old: T, new: T }, boolean> {

};
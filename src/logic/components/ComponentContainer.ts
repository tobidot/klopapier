import { Task } from "../tasks/Task";
import MapObjectComponent from "./MapObjectComponent";

export default class ComponentContainer<COMPONENT extends { constructor: { name: string }, update: (dt: number, ...args: any) => Task[] }> {
    private components: Map<string, COMPONENT> = new Map();

    constructor() {

    }

    public add(component: COMPONENT): this {
        this.components.set(component.constructor.name, component);
        return this;
    }

    public has<TARGET extends COMPONENT>(component_class: { new(...x: any): TARGET }): boolean {
        return this.components.has(component_class.name);
    }

    public get<TARGET extends COMPONENT>(component_class: { new(...x: any): TARGET }): TARGET | undefined {
        return this.components.get(component_class.name) as TARGET | undefined;
    }

    public remove(component_class: { new(...x: any): any }): boolean {
        return this.components.delete(component_class.name);
    }

    public update(delta_seconds: number, ...args: any): Task[] {
        let tasks: Task[] = [];
        this.components.forEach((component) => {
            tasks.push(...component.update(delta_seconds, ...args));
        });
        return tasks;
    }

    public each(callback: (component: COMPONENT) => void) {
        this.components.forEach(callback);
    }

    public get_all(): Array<COMPONENT> {
        return [...this.components.values()];
    }
}
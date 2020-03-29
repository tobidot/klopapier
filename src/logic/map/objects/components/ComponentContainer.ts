
export default class ComponentContainer<COMPONENT extends { name: string }> {
    private components: Map<string, COMPONENT> = new Map();

    constructor() {

    }

    public add(component: COMPONENT): this {
        this.components.set(component.name, component);
        return this;
    }

    public has(name: string): boolean {
        return this.components.has(name);
    }

    public get<TARGET extends COMPONENT>(component_class: { new(...x: any): TARGET, NAME: string }): TARGET | undefined {
        return this.components.get(component_class.NAME) as TARGET;
    }
}
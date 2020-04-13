export function assert_class_type<BASE, DERIVE extends BASE>(object: BASE, class_arg: { new(...x: any): DERIVE, name: string }): object is DERIVE {
    if (object instanceof class_arg === false) {
        throw new Error("Object should be of type " + class_arg.name);
        return false;
    }
    return true;
};
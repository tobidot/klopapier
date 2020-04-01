import { randomBytes } from "crypto";

export function get_random_of_array<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    const i = Math.floor(Math.random() * array.length);
    return array[i];
}
export function generate<T>(n: number, callback: (n: number) => T): Array<T> {
    let buffer = [];
    for (let i = 0; i < n; ++i) buffer.push(callback(i));
    return buffer;
}   
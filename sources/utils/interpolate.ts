import { Point } from "../modules/primitives/Point";

export function interpolate<T extends number | Point>(v: number, from: T, to: T): T {
    if (from instanceof Point && to instanceof Point) {
        return new Point({
            x: interpolate(v, from.x, to.x),
            y: interpolate(v, from.y, to.y),
        }) as T;
    }
    if (typeof from === 'number' && typeof to === 'number') {
        return (from + (to - from) * v) as T;
    }
    throw new Error(`Cannot interpolate ${from} and ${to}`);
}
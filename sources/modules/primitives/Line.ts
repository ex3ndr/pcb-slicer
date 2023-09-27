import { cache } from "../../utils/cache";
import { Point } from "./Point";

export class Line {

    public readonly start: Point;
    public readonly end: Point;

    constructor(a: Point, b: Point) {
        this.start = a;
        this.end = b;
    }

    @cache
    get length() {
        return Math.sqrt(Math.pow(this.start.x - this.start.x, 2) + Math.pow(this.start.y - this.start.y, 2));
    }

    @cache
    get midpoint(): Point {
        return new Point({ x: (this.start.x + this.end.x) / 2, y: (this.start.y + this.end.y) / 2 });
    }
}
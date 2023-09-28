import { cache } from "../../utils/cache";
import { Point } from "./Point";

export class Vector {

    public readonly start: Point;
    public readonly end: Point;

    constructor(a: Point, b: Point) {
        this.start = a;
        this.end = b;
    }

    @cache
    get length() {
        return Math.sqrt(Math.pow(this.start.x - this.end.x, 2) + Math.pow(this.start.y - this.end.y, 2));
    }

    @cache
    get midpoint(): Point {
        return new Point({ x: (this.start.x + this.end.x) / 2, y: (this.start.y + this.end.y) / 2 });
    }

    @cache
    get inversed(): Vector {
        return new Vector(this.end, this.start);
    }

    @cache
    get normalised(): Vector {
        return this.multiply(1 / this.length);
    }

    multiply = (v: number): Vector => {

        // Get length
        let l = this.length;
        if (l === 0) return this;

        // Get new end point
        let x = this.start.x + (this.end.x - this.start.x) / l * v;
        let y = this.start.y + (this.end.y - this.start.y) / l * v;

        // Return new vector
        return new Vector(this.start, Point.from({ x, y }));
    }
}
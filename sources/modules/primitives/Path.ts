import { EPSILON } from "../../utils/EPSILON";
import { cache } from "../../utils/cache";
import { Line } from "./Line";
import { Point, PointProps } from "./Point";

export type PathProps = { points: PointProps[] } | PointProps[];

export class Path {

    static from(src: PathProps) {
        return new Path(Array.isArray(src) ? src.map(p => Point.from(p)) : src.points.map(p => Point.from(p)));
    }

    readonly points: Point[];

    constructor(points: Point[]) {
        if (points.length < 2) throw new Error("A path must have at least two points");
        this.points = points;
    }

    @cache
    get length() {
        let length = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            length += this.points[i].distanceTo(this.points[i + 1]);
        }
        return length;
    }

    @cache
    get lines(): Line[] {
        const lines: Line[] = [];
        for (let i = 0; i < this.points.length - 1; i++) {
            lines.push(new Line(this.points[i], this.points[i + 1]));
        }
        return lines;
    }

    @cache
    get isClosed() {
        return this.points[0].distanceTo(this.points[this.points.length - 1]) < EPSILON;
    }
}
import { cache } from "../../utils/cache";
import { Vector } from "./Vector";
import { Point, PointProps } from "./Point";
import { EPSILON } from "../../constants";

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

    get origin() {
        return this.points[0];
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
    get vectors(): Vector[] {
        const lines: Vector[] = [];
        for (let i = 0; i < this.points.length - 1; i++) {
            lines.push(new Vector(this.points[i + 1].x - this.points[i].x, this.points[i + 1].y - this.points[i].y));
        }
        return lines;
    }

    @cache
    get isClosed() {
        return this.points[0].equals(this.points[this.points.length - 1]);
    }

    split(at: number): [Path, Path] {
        if (at <= 0) throw new Error("Invalid split position");
        if (at >= this.length) throw new Error("Invalid split position");

        // Compute split
        const first: Point[] = [this.points[0]];
        const second: Point[] = [];
        let remaining = at;
        let splitReady = false;
        for (let i = 1; i < this.points.length; i++) {
            if (splitReady) {
                // Add remaining points to second path
                second.push(this.points[i]);
            } else {
                let v = Vector.between(this.points[i - 1], this.points[i]);
                let d = v.length;

                if (d < remaining) {
                    // If length of this line is less than remaining
                    remaining -= d;
                    first.push(this.points[i]);
                } else {

                    // If split is too small, just push everything to the second path
                    if (remaining < EPSILON) {
                        first.push(this.points[i]);
                        second.push(this.points[i]);
                    } else {
                        let [a, b] = v.split(remaining);
                        let splitPoint = this.points[i - 1].add(a);
                        first.push(this.points[i - 1]);
                        first.push(splitPoint);
                        second.push(splitPoint);
                        second.push(splitPoint.add(b));
                    }

                    // Complete split
                    splitReady = true;
                    remaining = 0;
                }
            }
        }

        // Return split paths
        return [new Path(first), new Path(second)];
    }
}
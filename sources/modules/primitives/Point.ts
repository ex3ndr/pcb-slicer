import { cache } from "../../utils/cache";
import { Vector } from "./Vector";

export type PointProps = { x: number, y: number };

export class Point {

    static from(src: PointProps) {
        return new Point(src);
    }

    readonly x: number;
    readonly y: number;

    constructor(props: PointProps) {
        this.x = props.x;
        this.y = props.y;
    }

    @cache
    get asVector(): Vector {
        return new Vector(this.x, this.y);
    }

    add(src: Vector): Point {
        return new Point({ x: this.x + src.dx, y: this.y + src.dy });
    }

    distanceTo(point: Point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}
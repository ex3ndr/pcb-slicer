import { cache } from "../../utils/cache";
import { PointProps } from "./Point";

export class Vector {

    static from(dx: number, dy: number): Vector {
        return new Vector(dx, dy);
    }

    static between(a: PointProps, b: PointProps): Vector {
        return new Vector(b.x - a.x, b.y - a.y);
    }

    public readonly dx: number;
    public readonly dy: number;

    constructor(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy
    }

    @cache
    get length() {
        return Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
    }

    @cache
    get inversed(): Vector {
        return new Vector(-this.dx, -this.dy);
    }

    @cache
    get isDot(): boolean {
        return this.length === 0;
    }

    @cache
    get normalised(): Vector {
        return this.multiply(1 / this.length);
    }

    split(at: number): [Vector, Vector] {

        // Check if split is possible
        let lengthA = at;
        let lengthB = this.length - at;
        if (lengthA <= 0) throw new Error("Invalid split position");
        if (lengthB <= 0) throw new Error("Invalid split position");

        // Split vector in two
        let vector = this.normalised;
        return [vector.multiply(lengthA), vector.multiply(lengthB)];
    }

    add(v: Vector): Vector {
        return new Vector(this.dx + v.dx, this.dy + v.dy);
    }

    multiply = (v: number): Vector => {
        let l = this.length;
        return new Vector(this.dx * v / l, this.dy * v / l);
    }
}
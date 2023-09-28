import { EPSILON } from "../../utils/EPSILON";
import { cache } from "../../utils/cache";

export class Vector {

    static from(dx: number, dy: number): Vector {
        return new Vector(dx, dy);
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
        if (lengthA <= EPSILON) throw new Error("Invalid split position");
        if (lengthB <= EPSILON) throw new Error("Invalid split position");

        // Split vector in two
        let vector = this.normalised;
        return [vector.multiply(lengthA), vector.multiply(lengthB)];
    }

    multiply = (v: number): Vector => {
        let l = this.length;
        return new Vector(this.dx * v / l, this.dy * v / l);
    }
}
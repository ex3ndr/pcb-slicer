import { EPSILON } from "../../constants";
import { Path } from "./Path";
import { Vector } from "./Vector";

export class PathWalker {

    private path: Path;
    private nextMode: 'forward' | 'backward';
    private allowCycles: boolean;
    private queue: Vector[] = [];
    private cycleCount: number = 0;

    constructor(options: { path: Path, startAt?: 'begining' | 'end', allowCycles?: boolean }) {
        this.path = options.path;
        this.allowCycles = options.allowCycles || false;

        if (this.allowCycles && this.path.isClosed) {
            this.nextMode = 'forward'; // Ignoring startAt since it's a cycle
        } else {
            if (options.startAt === 'begining') {
                this.nextMode = 'forward';
            } else {
                this.nextMode = 'backward';
            }
        }
        this.#populate();
    }

    get cycles() {
        return this.cycleCount;
    }

    #populate() {
        if (this.nextMode === 'forward') {
            this.queue = this.path.vectors.slice();
            if (!this.allowCycles || !this.path.isClosed) {
                this.nextMode = 'backward';
            }
        } else {
            this.queue = this.path.vectors.slice().reverse().map((v) => v.inversed);
            this.nextMode = 'forward'; // It is not a cycle - invert direction
        }
    }

    next() {

        // Populate queue if needed
        if (this.queue.length === 0) {
            this.#populate();
            this.cycleCount++;
        }

        // Return next vector
        return this.queue.shift()!;
    }

    nextDistance(distance: number): Vector[] {
        let remaining = distance;
        let res: Vector[] = [];

        // Filling the result
        while (remaining > 0) {
            let vector = this.next();
            if (remaining < vector.length + EPSILON) {
                // Vector is partially consumed
                let consumed = vector.normalised.multiply(remaining);
                let next = vector.add(consumed.inversed);
                res.push(consumed);
                this.queue.unshift(next);
                remaining = 0;
            } else {
                // Vector is fully consumed
                res.push(vector);
                remaining -= vector.length;
            }
        }

        return res;
    }

    tillNextCycle(): Vector[] {
        let res: Vector[] = [];
        while (true) {
            let n = this.next();
            res.push(n);
            if (this.queue.length === 0) {
                return res;
            }
        }
    }

    push(v: Vector) {
        this.queue.push(v);
    }
}
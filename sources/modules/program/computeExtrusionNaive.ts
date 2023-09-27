import type { Path } from "../primitives/Path";
import type { Point } from "../primitives/Point";
import type { ProgramBuilder } from "./ProgramBuilder";

export function computeExtrusionNaive(to: ProgramBuilder, options: { path: Path, offset: Point, feed: number, extrudeFactor: number }) {

    // For each line
    for (let l of options.path.lines) {

        // Compute extrusion
        let e = l.length * options.extrudeFactor;

        // Move to next point extrudin along the way
        to = to.add({ x: l.end.x + options.offset.x, y: l.end.y + options.offset.y, e, f: options.feed });
    }

    // Return builder
    return to;
}
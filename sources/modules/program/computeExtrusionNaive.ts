import type { Path } from "../primitives/Path";
import type { Point } from "../primitives/Point";
import type { ProgramBuilder } from "./ProgramBuilder";
import { calculateTotalExtrusionDistance } from "./extrusion";

export function computeExtrusionNaive(to: ProgramBuilder, options: { path: Path, offset: Point, feed: number, extrudeFactor: number }) {

    // Low down
    to = to.zDown();

    // For each line
    for (let l of options.path.lines) {

        // Compute extrusion
        let e = calculateTotalExtrusionDistance({ nozzle: to.config.extrusion.nozzle, length: l.length }) * options.extrudeFactor;

        // Move to next point extrudin along the way
        to = to.add({ x: l.end.x + options.offset.x, y: l.end.y + options.offset.y, e, f: options.feed });
    }

    // Lift up
    to = to.zHop();

    // Return builder
    return to;
}
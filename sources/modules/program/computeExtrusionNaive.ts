import type { Path } from "../math/Path";
import type { Point } from "../math/Point";
import type { ProgramBuilder } from "./ProgramBuilder";
import { extrusionDistance } from "../math/extrusion";

export function computeExtrusionNaive(to: ProgramBuilder, options: { path: Path, offset: Point, feed: number, extrudeFactor: number }) {

    // Low down
    to = to.zDown();

    // For each line
    let current = options.path.origin.add(options.offset.asVector);
    for (let l of options.path.vectors) {

        // Update current position
        current = current.add(l);

        // Compute extrusion
        let e = extrusionDistance({ nozzle: to.config.extrusion.nozzle, length: l.length }) * options.extrudeFactor;

        // Move to next point extrudin along the way
        to = to.add({ x: current.x, y: current.y, e, f: options.feed });
    }

    // Lift up
    to = to.zHop();

    // Return builder
    return to;
}
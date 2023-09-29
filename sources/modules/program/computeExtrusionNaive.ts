import type { Path } from "../math/Path";
import type { ProgramBuilder } from "./ProgramBuilder";
import { extrusionDistance } from "../math/extrusion";

export function computeExtrusionNaive(to: ProgramBuilder, options: { path: Path, extrudeFactor: number }) {

    // Low down
    to = to.zDown();

    // For each line
    let current = options.path.origin;
    for (let l of options.path.vectors) {

        // Update current position
        current = current.add(l);

        // Compute extrusion
        let e = extrusionDistance({ nozzle: 0.23 /* I dont have another nozzles anyway */, length: l.length }) * options.extrudeFactor;

        // Move to next point extrudin along the way
        to = to.add({ x: current.x, y: current.y, e, f: to.config.speed.xy });
    }

    // Lift up
    to = to.zHop();

    // Return builder
    return to;
}
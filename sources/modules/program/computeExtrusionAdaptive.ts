import { Path } from "../primitives/Path";
import { Point } from "../primitives/Point";
import { ProgramBuilder } from "./ProgramBuilder";
import { calculateTotalExtrusionDistance } from "./extrusion";

export function computeExtrusionAdaptive(to: ProgramBuilder, options: {
    path: Path,
    offset: Point,
    xyspeed: number,
    zspeed: number,
    extrudeFactor: number
}) {

    // Calculate extrusion for whole path
    let e = calculateTotalExtrusionDistance({ nozzle: to.config.extrusion.nozzle, length: options.path.length }) * options.extrudeFactor;

    // Low down and extrude
    to = to.add({ z: to.config.extrusion.height, f: options.zspeed, e });

    // Follow path
    for (let l of options.path.lines) {
        to = to.add({ x: l.end.x + options.offset.x, y: l.end.y + options.offset.y, f: options.xyspeed });
    }

    // Lift up
    to = to.zHop();

    return to;
}
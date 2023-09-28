import { Vector } from "../primitives/Vector";
import { Path } from "../primitives/Path";
import { Point } from "../primitives/Point";
import { ProgramBuilder } from "./ProgramBuilder";
import { calculateTotalExtrusionDistance } from "./extrusion";

export function computeExtrusionAdaptive(to: ProgramBuilder, options: {
    path: Path,
    offset: Point,
    xyspeed: number,
    zspeed: number,
    extrudeFactor: number,
    extrudeAdvance: number,
    deOozingDistance: number
}) {

    // Current posision
    let posision = options.path.origin.add(options.offset.asVector);

    // Build extrusion pressure
    to = to.comment('Build pressure');
    let e = calculateTotalExtrusionDistance({ nozzle: to.config.extrusion.nozzle, length: options.path.length }) * options.extrudeFactor + options.extrudeAdvance;
    to = to.add({ z: to.config.extrusion.height, f: options.zspeed, e });

    // Follow path
    to = to.comment('Main extrusion');
    for (let l of options.path.vectors) {
        posision = posision.add(l);
        to = to.add({ x: posision.x, y: posision.y, f: options.xyspeed });
    }

    // Lift up and retract
    to = to.comment('Release pressure');
    to = to.add({ z: to.config.extrusion.height + to.config.extrusion.zHop, f: options.zspeed, e: -options.extrudeAdvance });

    // Move down to move backwards to hide oozed material
    to = to.comment('De-ooze');
    to = to.add({ z: to.config.extrusion.height, f: options.zspeed });

    // De-ooze
    let remainingDistance = options.deOozingDistance;
    let remainingPath: Vector[] = [];
    let backwardPass = true;
    while (remainingDistance > 0) {

        // Populate pending lines
        if (remainingPath.length === 0) {
            if (backwardPass) {
                remainingPath = options.path.vectors.slice().reverse().map((v) => v.inversed);
                backwardPass = false;
            } else {
                remainingPath = options.path.vectors.slice();
                backwardPass = true;
            }
        }

        // Get next line
        let vec = remainingPath.shift()!;

        // Get next point and adjust distance
        if (vec.length >= remainingDistance) {
            vec = vec.normalised.multiply(remainingDistance);
            remainingDistance = 0;
        } else {
            remainingDistance -= vec.length;
        }

        // Move to the next line
        posision = posision.add(vec);
        to = to.add({ x: posision.x, y: posision.y, f: options.xyspeed });
    }

    // Lift up
    to = to.newLine();
    to = to.zHop();
    to = to.newLine();

    return to;
}
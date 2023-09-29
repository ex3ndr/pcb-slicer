import { Vector } from "../math/Vector";
import { Path } from "../math/Path";
import { Point } from "../math/Point";
import { ProgramBuilder } from "./ProgramBuilder";
import { extrusionDistance } from "../math/extrusion";
import { compoundFeed, maximumFeed } from "../math/speeds";
import { PathWalker } from "../math/PathWalker";

export function computeExtrusionAdaptive(to: ProgramBuilder, options: {
    path: Path,
    offset: Point,
    xyspeed: number,
    zspeed: number,
    espeed: number,
    extrudeFactor: number,
    extrudeAdvance: number,
    deOozingDistance: number
}) {

    // Current posision
    let posision = options.path.origin.add(options.offset.asVector);

    // Calculate used extrusion distance
    let usedExtrusionDistance = extrusionDistance({ nozzle: to.config.extrusion.nozzle, length: options.path.length }) * options.extrudeFactor;

    // Split pressure advance into XY and Z components
    let advanceFactor = 0.5;
    let advanceZ = options.extrudeAdvance * advanceFactor;
    let advanceXY = options.extrudeAdvance * (1 - advanceFactor);
    let advanceXYDistance = advanceXY * options.xyspeed / options.espeed;

    // Walker to traverse the path
    let walker = new PathWalker({ path: options.path, startAt: 'begining', allowCycles: true });

    //
    // 1. Build pressure
    //

    to = to.comment('Build pressure');
    let initialFeed = maximumFeed(
        { distance: to.config.extrusion.zHop, speed: options.zspeed },
        { distance: advanceZ, speed: options.espeed }
    );
    to = to.add({ z: to.config.extrusion.height, e: advanceZ, f: compoundFeed(...initialFeed) });

    //
    // 2. Extrude remaining part of a feature
    //

    to = to.comment('Main extrusion');
    for (let l of walker.nextDistance(advanceXYDistance)) {
        posision = posision.add(l);
        let e = l.length * options.espeed / options.xyspeed;
        to = to.add({ x: posision.x, y: posision.y, e: e, f: options.xyspeed });
    }
    if (walker.cycles === 0) {
        for (let l of walker.tillNextCycle()) {
            posision = posision.add(l);
            to = to.add({ x: posision.x, y: posision.y, f: options.xyspeed });
        }
    }

    //
    // 3. Releasing pressure
    //

    to = to.comment('Release pressure');
    to = to.add({ z: to.config.extrusion.height + to.config.extrusion.zHop, f: options.zspeed, e: -(options.extrudeAdvance - usedExtrusionDistance) });

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
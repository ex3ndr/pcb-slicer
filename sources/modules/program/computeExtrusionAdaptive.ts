import { Path } from "../math/Path";
import { Point } from "../math/Point";
import { ProgramBuilder } from "./ProgramBuilder";
import { PathWalker } from "../math/PathWalker";
import { EPSILON } from "../../constants";
import { calculatePressureAdvanceParameters } from "./adaptive";

export function computeExtrusionAdaptive(to: ProgramBuilder, options: {
    path: Path,
    kFactor: number,
    pressureAdvance: number,
    deOozingDistance: number,
    advanceFactor: number,
    releaseFactor: number,
}) {

    // Speeds
    let config = to.config;
    let speeds = to.config.speed;

    // Current posision
    let posision = options.path.origin;

    // Calculate pressure advance
    let pressure = calculatePressureAdvanceParameters({
        distance: options.path.length,
        speeds: speeds,
        material: {
            kFactor: options.kFactor,
            pressureAdvance: options.pressureAdvance,
            advanceFactor: options.advanceFactor,
            releaseFactor: options.releaseFactor
        }
    })

    // Walker to traverse the path
    let walker = new PathWalker({ path: options.path, startAt: 'begining', allowCycles: true });

    //
    // 1. Build pressure
    //

    to = to.comment('Build pressure');
    to = to.extrude({
        e: { distance: pressure.advance.zExtrusion, speed: speeds.e },
        z: { to: config.extrusion.height, distance: config.extrusion.zHop, speed: speeds.z }
    });

    //
    // 2. Extrude remaining part of a feature
    //

    to = to.comment('Main extrusion');
    if (pressure.advance.distance > EPSILON) { // Ignore too small xy advance
        for (let l of walker.nextDistance(pressure.advance.distance)) {
            posision = posision.add(l);
            let e = l.length * speeds.e / speeds.xy;
            to = to.add({ x: posision.x, y: posision.y, e: e, f: speeds.xy }); // Feed is always maximum and don't need to be re-calculated
        }
    }
    if (walker.cycles === 0) {
        for (let l of walker.tillNextCycle()) {
            posision = posision.add(l);
            to = to.add({ x: posision.x, y: posision.y, f: speeds.xy });
        }
    }


    //
    // 3. Releasing pressure
    //

    to = to.comment('Release pressure');
    if (pressure.release.distance > EPSILON) { // Ignore too small xy release
        for (let l of walker.nextDistance(pressure.release.distance)) {
            posision = posision.add(l);
            let e = -l.length * speeds.e / speeds.xy;
            to = to.add({ x: posision.x, y: posision.y, e: e, f: speeds.xy }); // Feed is always maximum and don't need to be re-calculated
        }
    }
    to = to.extrude({
        e: { distance: -pressure.release.zExtrusion, speed: speeds.e },
        z: { to: config.extrusion.height + config.extrusion.zHop, distance: config.extrusion.zHop, speed: speeds.z }
    });

    //
    // 4. De-oozing
    //

    if (options.deOozingDistance > EPSILON) {
        to = to.comment('De-ooze');
        to = to.add({ z: to.config.extrusion.height, f: speeds.z });
        for (let l of walker.nextDistance(options.deOozingDistance)) {
            posision = posision.add(l);
            to = to.add({ x: posision.x, y: posision.y, f: speeds.xy });
        }
    }

    // Lift up
    to = to.newLine();
    to = to.zHop();
    to = to.newLine();

    return to;
}
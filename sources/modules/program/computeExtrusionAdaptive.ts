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
    let advanceFactor = 0.1;
    let advanceZ = options.extrudeAdvance * (1 - advanceFactor);
    let advanceXY = options.extrudeAdvance * advanceFactor;
    let advanceXYDistance = advanceXY * options.xyspeed / options.espeed;

    // Calculate pressure release
    let releaseFactor = 0.9;
    let releaseZ = (options.extrudeAdvance - usedExtrusionDistance) * (1 - releaseFactor);
    let releaseXY = (options.extrudeAdvance - usedExtrusionDistance) * releaseFactor;
    let releaseXYDistance = releaseXY * options.xyspeed / options.espeed;

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
    for (let l of walker.nextDistance(releaseXYDistance)) {
        posision = posision.add(l);
        let e = -l.length * options.espeed / options.xyspeed;
        to = to.add({ x: posision.x, y: posision.y, e: e, f: options.xyspeed });
    }
    let releaseFeed = maximumFeed(
        { distance: to.config.extrusion.zHop, speed: options.zspeed },
        { distance: releaseZ, speed: options.espeed }
    );
    to = to.add({ z: to.config.extrusion.height + to.config.extrusion.zHop, e: -releaseZ, f: compoundFeed(...releaseFeed) }); // Do we need to lift?

    //
    // 4. De-oozing
    //

    to = to.comment('De-ooze');
    to = to.add({ z: to.config.extrusion.height, f: options.zspeed });
    for (let l of walker.nextDistance(options.deOozingDistance)) {
        posision = posision.add(l);
        to = to.add({ x: posision.x, y: posision.y, f: options.xyspeed });
    }

    // Lift up
    to = to.newLine();
    to = to.zHop();
    to = to.newLine();

    return to;
}
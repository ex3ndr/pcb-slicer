import fs from 'fs';
import { ProgramBuilder } from './modules/program/ProgramBuilder';
import { CONFIG_DEFAULTS, Config } from './modules/config/Config';
import { interpolate } from './modules/math/interpolate';
import { PointProps } from './modules/math/Point';
import { extrusionFromPlunge } from './modules/math/extrusion';

// Create builder
const config: Config = {
    ...CONFIG_DEFAULTS,
}
const builder = new ProgramBuilder(config);

// Start print
builder.startPrint();

let count = 10;
for (let i = 0; i < count; i++) {

    //
    // Parameters 
    //

    let padding = 3;
    let side = 3;
    let x = 10;
    let y = i * (padding + side) + 50;
    let progress = i / (count - 1);

    // Go to path start
    builder.startFeature({ name: 'Path ' + i, at: { x, y } });

    // Draw path
    let path: PointProps[] = [
        { x: 0, y: 0 },
        { x: side, y: 0 },
        { x: side, y: side },
        { x: 0, y: side },
        { x: 0, y: 0 }
    ];
    builder.extrusionFeature({
        path: path,
        offset: { x, y },

        // Target speeds
        zspeed: 5,
        xyspeed: 5,
        espeed: 40,

        // This is the factor that is used to compute used material volume. Since formula is unclear i left it as a parameter
        extrudeFactor: 0.5,

        // It seems that his is called "kick" in ink database, this value is 3 times less than mine but in my tests it worked too
        // 0.3 means rotating the dispenser by roughtly 1/2 of a turn
        // extrudeAdvance: extrusionFromPlunge(0.3), // Does not work
        extrudeAdvance: extrusionFromPlunge(interpolate(progress, 0.3, 1)),

        // In ink database it seems to be called "antiString" and it is something like "0.1".
        // It is not clear what this value means but 0.1 seems to be too small, but 2mm seems to be too big too
        deOozingDistance: 2
    });

    // Padding
    builder.move({ to: { x: x + side + 5, y }, feed: 5 });

    // Draw path without extrusion
    builder.zDown();
    builder.move({ to: { x: x + side * 2 + 5, y }, feed: 5 });

    // Lift up
    builder.endFeature();
}

// End print
builder.comment('End print');
builder.move({ to: { x: -35, y: 100 }, feed: 50 });

fs.writeFileSync('./programs/lines.gcode', builder.build());
import fs from 'fs';
import { ProgramBuilder } from './modules/program/ProgramBuilder';
import { CONFIG_DEFAULTS, Config } from './modules/config/Config';
import { interpolate } from './utils/interpolate';
import { PointProps } from './modules/primitives/Point';

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

    let padding = 10;
    let side = 5;
    let x = 10;
    let y = i * padding + 50;

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
        zspeed: 20,
        xyspeed: 5,
        extrudeAdvance: 40,
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
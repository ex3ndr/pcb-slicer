import fs from 'fs';
import { ProgramBuilder } from './modules/program/ProgramBuilder';
import { CONFIG_DEFAULTS, Config } from './modules/config/Config';
import { interpolate } from './utils/interpolate';

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

    let padding = 5;
    let side = 20;
    let x = 10;
    let y = i * padding + 50;
    let progress = i / (count - 1);

    // Go to path start
    builder.startFeature({ name: 'Path ' + i, at: { x, y } });

    // Draw path
    builder.extrusionFeature({
        path: [
            { x: 0, y: 0 },
            { x: side, y: 0 }
        ],
        offset: { x, y },
        extrudeFactor: interpolate(progress, 20, 100),
        zspeed: 20,
        xyspeed: 5,
    });

    // Draw path without extrusion
    builder.zDown();
    builder.move({ to: { x: x + side * 2, y }, feed: 5 });

    // Lift up
    builder.endFeature();
}

// End print
builder.comment('End print');
builder.move({ to: { x: -35, y: 100 }, feed: 50 });

fs.writeFileSync('./programs/lines.gcode', builder.build());
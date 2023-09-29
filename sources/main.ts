// import fs from 'fs';
// import { ProgramBuilder } from './modules/program/ProgramBuilder';
// import { CONFIG_DEFAULTS, Config } from './modules/config/Config';
// import { interpolate } from './modules/math/interpolate';
// import { PointProps } from './modules/math/Point';
// import { extrusionFromPlunge } from './modules/math/extrusion';
// import { createSquare } from './modules/program/shapes';

// // Create builder
// const config: Config = {
//     ...CONFIG_DEFAULTS,
// }
// const builder = new ProgramBuilder(config);

// // Start print
// builder.startPrint();

// let count = 10;
// for (let i = 0; i < count; i++) {

//     //
//     // Parameters 
//     //

//     let padding = 3;
//     let side = 3;
//     let progress = i / (count - 1);

//     // Go to path start
//     builder.startFeature({
//         name: 'Path ' + i,
//         at: {
//             x: 10,
//             y: i * (padding + side) + 50
//         }
//     });

//     // Draw path
//     let path = createSquare(side);
//     builder.extrusionFeature(path, {

//         // This is the factor that is used to compute used material volume. Since formula is unclear i left it as a parameter
//         kFactor: 0.5,

//         // It seems that his is called "kick" in ink database, this value is 3 times less than mine but in my tests it worked too
//         // 0.3 means rotating the dispenser by roughtly 1/2 of a turn
//         pressureAdvance: interpolate(progress, 0.3, 1),
//         advanceFactor: 0.1,
//         releaseFactor: 0.1,

//         // In ink database it seems to be called "antiString" and it is something like "0.1".
//         // It is not clear what this value means but 0.1 seems to be too small, but 2mm seems to be too big too
//         deOozingDistance: 2
//     });

//     // Padding
//     builder.move({ to: { x: side + 5, y: 0 }, feed: 5 });

//     // Draw path without extrusion
//     builder.zDown();
//     builder.move({ to: { x: side * 2 + 5, y: 0 }, feed: 5 });

//     // Lift up
//     builder.endFeature();
// }

// // End print
// builder.comment('End print');
// builder.move({ to: { x: -35, y: 100 }, feed: 50 });

// fs.writeFileSync('./programs/lines.gcode', builder.build());

import fs from 'fs';
import { createPressureAdvance } from './calibration/createPressureAdvance';
fs.writeFileSync('./programs/pressure.gcode', createPressureAdvance());
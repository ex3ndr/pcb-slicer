import { CONFIG_DEFAULTS } from "../modules/config/Config";
import { ProgramBuilder } from "../modules/program/ProgramBuilder";
import { calculatePressureAdvanceParameters } from "../modules/program/adaptive";

export function createPressureAdvance() {
    const builder = new ProgramBuilder(CONFIG_DEFAULTS);
    builder.startPrint();

    // Parameters
    const from = 0.3;
    const to = 0.6;
    const delta = 0.05;
    const lineLength = 100;
    const config = builder.config;
    const speeds = CONFIG_DEFAULTS.speed;

    // Prime nozzle
    builder.startFeature({
        name: 'Prime Nozzle',
        at: { x: 0, y: 10 }
    })
    builder.zDown();
    builder.move({ to: { x: lineLength, y: 0 }, feed: speeds.xy });
    builder.zHop();

    // Draw lines
    let current = from;
    let offset = 20;
    while (current <= to) {

        // Calculate parameters
        let pressure = calculatePressureAdvanceParameters({
            distance: 30,
            speeds: speeds,
            material: {
                pressureAdvance: current,

                // Disable XY pressure advance/release
                advanceFactor: 0,
                releaseFactor: 0,

                // Barely used
                kFactor: 1,
            }
        });

        // Draw line
        builder.startFeature({
            name: 'Pressure advance ' + current.toFixed(2),
            at: {
                x: 0,
                y: offset
            }
        });
        builder.extrude({
            e: { distance: pressure.advance.zExtrusion, speed: speeds.e },
            z: { to: config.extrusion.height, distance: config.extrusion.zHop, speed: speeds.z }
        });
        builder.move({ to: { x: lineLength, y: 0 }, feed: speeds.xy });
        builder.zHop();

        current += delta;
        offset += 10;
    }

    builder.move({ to: { x: -35, y: 100 }, feed: 50 });
    return builder.build();
}
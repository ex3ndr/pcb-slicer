import { CONFIG_DEFAULTS } from "../modules/config/Config";
import { ProgramBuilder } from "../modules/program/ProgramBuilder";

export function createPressureAdvance() {
    const builder = new ProgramBuilder(CONFIG_DEFAULTS);
    builder.startPrint();

    // Parameters
    const from = 0.3;
    const to = 0.6;
    const delta = 0.05;

    // Draw lines
    let current = from;
    let offset = 10;
    while (current <= to) {

        
        current += delta;
    }

    builder.move({ to: { x: -35, y: 100 }, feed: 50 });
    return builder.build();
}
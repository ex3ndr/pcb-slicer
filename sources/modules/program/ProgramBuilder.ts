import { Config } from "../config/Config";
import { Path, PathProps } from "../primitives/Path";
import { Point, PointProps } from "../primitives/Point";
import { ToolPathCommand, ToolPathCommandProps } from "./ToolPathCommand";
import { computeExtrusionNaive } from "./computeExtrusionNaive";

export class ProgramBuilder {
    #commands: (string | ToolPathCommand)[] = [];
    #config: Config;

    constructor(config: Config) {
        this.#config = config;
    }

    //
    // Basic operations
    //

    add(command: (string | ToolPathCommand | ToolPathCommandProps) | (string | ToolPathCommand | ToolPathCommandProps)[]) {
        if (typeof command === 'string') {
            this.#commands.push(command);
        } else if (Array.isArray(command)) {
            for (let c of command) {
                this.add(c);
            }
        } else if (command instanceof ToolPathCommand) {
            this.#commands.push(command);
        } else {
            this.add(new ToolPathCommand(command));
        }
        return this;
    }

    comment(text: string) {
        return this.add(`; ${text}`);
    }

    newLine() {
        return this.add('');
    }

    zHop() {
        return this.add({ z: this.#config.extrusion.height + this.#config.extrusion.zHop, f: this.#config.speed.z });
    }

    zDown() {
        return this.add({ z: this.#config.extrusion.height, f: this.#config.speed.z });
    }

    move(opts: { to: PointProps, feed?: number }) {
        return this.add({ x: opts.to.x, y: opts.to.y, f: opts.feed || this.#config.speed.xy });
    }

    //
    // Start/end of feature
    //

    startFeature(props: { name: string, at: PointProps }) {
        return this.comment('Start ' + props.name)
            .move({ to: props.at });
    }

    endFeature() {
        return this.zHop()
            .newLine();
    }

    //
    // Start/end of print
    //

    startPrint() {
        return this.comment('Beging print')
            .add('G90') // Absolute positioning
            .add('G21') // Millimeter units
            .add('M83') // Relative E
            .zHop() // Lift up
            .newLine();
    }

    //
    // Extrusions
    //

    naiveExtrusionFeature(args: { path: PathProps, offset: PointProps, feed: number, extrudeFactor: number }) {
        return computeExtrusionNaive(this, {
            path: Path.from(args.path),
            offset: Point.from(args.offset),
            feed: args.feed,
            extrudeFactor: args.extrudeFactor,
        });
    }

    //
    // Finalize
    //

    build() {
        let res = '';
        for (let cmd of this.#commands) {
            if (typeof cmd === 'string') {
                res += cmd + '\n';
            } else {
                res += cmd.gcode + '\n';
            }
        }
        return res;
    }
}
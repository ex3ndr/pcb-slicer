import { Config } from "../config/Config";
import { Path, PathProps } from "../math/Path";
import { Point, PointProps } from "../math/Point";
import { extrusionFeed } from "../math/speeds";
import { ToolPathCommand, ToolPathCommandProps } from "./ToolPathCommand";
import { computeExtrusionAdaptive } from "./computeExtrusionAdaptive";
import { computeExtrusionNaive } from "./computeExtrusionNaive";

export class ProgramBuilder {
    #commands: (string | ToolPathCommand)[] = [];
    #config: Config;
    #offset = Point.from({ x: 0, y: 0 });

    constructor(config: Config) {
        this.#config = config;
    }

    get config() {
        return this.#config;
    }

    //
    // Basic operations
    //

    setWorkPosition(to: PointProps) {
        this.#offset = Point.from(to);
        return this;
    }

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
            this.add(new ToolPathCommand(command).translate(this.#offset));
        }
        return this;
    }

    extrude(command: {
        e: { distance: number, speed: number },
        x?: { to: number, distance: number, speed: number },
        y?: { to: number, distance: number, speed: number },
        z?: { to: number, distance: number, speed: number }
    }) {

        // Calculate feed
        let feeds: { distance: number, speed: number }[] = [];
        if (command.x) {
            feeds.push({ distance: command.x.distance, speed: command.x.speed });
        }
        if (command.y) {
            feeds.push({ distance: command.y.distance, speed: command.y.speed });
        }
        if (command.z) {
            feeds.push({ distance: command.z.distance, speed: command.z.speed });
        }
        let feed = extrusionFeed(command.e.distance, command.e.speed, ...feeds);

        return this.add({ x: command.x?.to, y: command.y?.to, z: command.z?.to, e: command.e.distance, f: feed });
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
        return this.add({ x: opts.to.x, y: opts.to.y, f: opts.feed || this.#config.speed.xyTravel });
    }

    //
    // Start/end of feature
    //

    startFeature(props: { name: string, at: PointProps }) {
        return this.comment('Start ' + props.name)
            .setWorkPosition(props.at)
            .move({ to: { x: 0, y: 0 } });
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

    endPrint() {
        return this.comment('End print')
            .move({ to: { x: -35, y: 100 }, feed: 50 });
    }

    //
    // Extrusions
    //

    extrusionFeatureNaive(path: PathProps, args: {
        kFactor: number
    }) {
        return computeExtrusionNaive(this, {
            path: Path.from(path),
            extrudeFactor: args.kFactor,
        });
    }

    extrusionFeature(path: PathProps, args: {
        kFactor: number,
        pressureAdvance: number,
        deOozingDistance: number,
        advanceFactor: number,
        releaseFactor: number,
    }) {
        return computeExtrusionAdaptive(this, {
            path: Path.from(path),
            kFactor: args.kFactor || 1,
            pressureAdvance: args.pressureAdvance,
            advanceFactor: args.advanceFactor,
            releaseFactor: args.releaseFactor,
            deOozingDistance: args.deOozingDistance
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
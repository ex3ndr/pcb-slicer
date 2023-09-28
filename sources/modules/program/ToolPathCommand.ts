import { formatNumber } from "../../utils/formatNumber";
import { Point } from "../primitives/Point";

export type ToolPathCommandProps = {
    x?: number;
    y?: number;
    z?: number;
    e?: number;
    f?: number;
}

export class ToolPathCommand {

    static from(src: ToolPathCommandProps) {
        return new ToolPathCommand(src);
    }

    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly e?: number;
    readonly f?: number;

    constructor(args: ToolPathCommandProps) {
        this.x = args.x;
        this.y = args.y;
        this.z = args.z;
        this.e = args.e;
        this.f = args.f;
    }

    get gcode() {
        let r = 'G1';
        if (this.x !== undefined) r += ` X${formatNumber(this.x)}`;
        if (this.y !== undefined) r += ` Y${formatNumber(this.y)}`;
        if (this.z !== undefined) r += ` Z${formatNumber(this.z)}`;
        if (this.e !== undefined) r += ` E${formatNumber(this.e)}`;
        if (this.f !== undefined) r += ` F${formatNumber(this.f * 60)}`;
        return r;
    }

    translate(by: Point) {
        return new ToolPathCommand({
            x: this.x !== undefined ? this.x + by.x : undefined,
            y: this.y !== undefined ? this.y + by.y : undefined,
            z: this.z,
            e: this.e,
            f: this.f
        });
    }
}
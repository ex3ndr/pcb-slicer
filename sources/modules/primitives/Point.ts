export type PointProps = { x: number, y: number };

export class Point {

    static from(src: PointProps) {
        return new Point(src);
    }

    readonly x: number;
    readonly y: number;

    constructor(props: PointProps) {
        this.x = props.x;
        this.y = props.y;
    }

    translate(by: Point) {
        return new Point({ x: this.x + by.x, y: this.y + by.y });
    }

    distanceTo(point: Point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}
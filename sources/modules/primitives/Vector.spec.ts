import { Vector } from "./Vector";
import { Point } from "./Point";

describe('Vector', () => {
    it('should calculate length', () => {
        expect(new Vector(Point.from({ x: 0, y: 0 }), Point.from({ x: 0, y: 0 })).length).toBe(0);
        expect(new Vector(Point.from({ x: 0, y: 0 }), Point.from({ x: 0, y: 10 })).length).toBe(10);
        expect(new Vector(Point.from({ x: 0, y: 0 }), Point.from({ x: 10, y: 0 })).length).toBe(10);
        expect(new Vector(Point.from({ x: 0, y: 0 }), Point.from({ x: 10, y: 5 })).length).toBe(11.180339887498949);
    });
});
import { Vector } from "./Vector";
import { Point } from "./Point";

describe('Vector', () => {
    it('should calculate length', () => {
        expect(new Vector(0, 0).length).toBe(0);
        expect(new Vector(0, 10).length).toBe(10);
        expect(new Vector(10, 0).length).toBe(10);
        expect(new Vector(10, 5).length).toBe(11.180339887498949);
    });
});
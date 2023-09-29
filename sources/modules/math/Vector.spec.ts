import { Vector } from "./Vector";

describe('Vector', () => {
    it('should calculate length', () => {
        expect(new Vector(0, 0).length).toBe(0);
        expect(new Vector(0, 10).length).toBe(10);
        expect(new Vector(10, 0).length).toBe(10);
        expect(new Vector(10, 5).length).toBe(11.180339887498949);
    });
    it('should split vector', () => {
        let [a, b] = new Vector(10, 5).split(5);

        // Check A
        expect(a.length).toBe(4.999999999999999);
        expect(a.dx).toBe(4.472135954999579);
        expect(a.dy).toBe(2.2360679774997894);

        // Check B
        expect(b.length).toBe(11.180339887498949 - 5);
        expect(b.dx).toBe(5.527864045000421);
        expect(b.dy).toBe(2.7639320225002106);

        // Check sum
        expect(a.add(b).length).toBe(11.180339887498949);
        expect(a.add(b).dx).toBe(10);
        expect(a.add(b).dy).toBe(5);
    });
});
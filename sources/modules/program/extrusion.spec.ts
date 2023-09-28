import { calculateRotationDistance } from "./extrusion";

describe('extrusion', () => {
    it('should calculate extrusion', () => {
        console.warn(calculateRotationDistance({ volume: 50, diameter: 1.75 }));
    });
});
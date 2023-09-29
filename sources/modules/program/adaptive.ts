import { extrusionDistance, extrusionFromPlunge } from "../math/extrusion";

export function calculatePressureAdvanceParameters(parameters: {

    // Print distance
    distance: number,

    // Print speeds
    speeds: {
        xy: number,
        e: number
    }

    // Material properties
    material: {
        kFactor: number, // Multiplier for material usage
        pressureAdvance: number, // How much pressure is required (in mm of syringe plunge movement)
        advanceFactor: number, // How much pressure is applied during XY movement
        releaseFactor: number // How much pressure is released during XY movement
    }
}) {

    // Convert pressure advance
    let pressureAdvance = extrusionFromPlunge(parameters.material.pressureAdvance);

    // Measure how much material is used
    let usedExtrusionDistance = extrusionDistance({ nozzle: 0.23 /* I am really don't have more nozzles */, length: parameters.distance }) * parameters.material.kFactor;

    // Calculate pressure advance
    let advanceFactor = parameters.material.advanceFactor;
    let advanceZ = pressureAdvance * (1 - advanceFactor);
    let advanceXY = pressureAdvance * advanceFactor;
    let advanceXYDistance = advanceXY * parameters.speeds.xy / parameters.speeds.e;

    // Calculate pressure release
    let releaseFactor = 0.9;
    let releaseZ = (pressureAdvance - usedExtrusionDistance) * (1 - releaseFactor);
    let releaseXY = (pressureAdvance - usedExtrusionDistance) * releaseFactor;
    let releaseXYDistance = releaseXY * parameters.speeds.xy / parameters.speeds.e;

    return {
        advance: {
            zExtrusion: advanceZ,
            xyExtrusion: advanceXY,
            distance: advanceXYDistance
        },
        release: {
            zExtrusion: releaseZ,
            xyExtrusion: releaseXY,
            distance: releaseXYDistance
        }
    };
}
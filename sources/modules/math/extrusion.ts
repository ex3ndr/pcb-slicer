import { PLUNGE_AREA } from "../../constants";

const BASE_DIAMETER = 1.75; // In firmware we use 1.75mm as base diameter to make calculations similar to 3d slicers
const BASE_SECTION = Math.pow(BASE_DIAMETER / 2, 2) * Math.PI; // Base section area

/**
 * Calculate total extrusion distance for a given path assumuing that the path section is simply semi-crcle
 * This function assumes that base diameter is 1.75mm
 */
export function extrusionDistance(props: { nozzle: number, length: number }): number {

    // Total extrusion volume (ideal)
    const volume = materialUsage(props);

    // Total extrusion distance
    return volume / BASE_SECTION;
}

/**
 * Calculates total material usage for a given path and nozzle
 */
export function materialUsage(props: { nozzle: number, length: number }) {

    //
    // NOTE: This is not clear if this is correct, we are assume that 
    //       section area is semi-crcle and nozzle is diameter of the
    //       semi-crcle, which is almost always not true
    //

    // Calculate area of semi-crcle
    const sectionArea = Math.pow(props.nozzle, 2) * Math.PI / 8;

    // Total extrusion volume (ideal)
    const volume = sectionArea * props.length;

    return volume;
}

/**
 * Converts the plunge distance to extrusion distance to match V One ink database
 * @param distance plunge distance
 */
export function extrusionFromPlunge(distance: number) {
    let volume = distance * PLUNGE_AREA;
    return volume / BASE_SECTION;
}
const BASE_DIAMETER = 1.75; // In firmware we use 1.75mm as base diameter to make calculations similar to 3d slicers

/**
 * Calculate total extrusion distance for a given path assumuing that the path section is simply semi-crcle
 * This function assumes that base diameter is 1.75mm
 */
export function calculateTotalExtrusionDistance(props: { nozzle: number, length: number }): number {

    // Calculate area of semi-crcle
    const sectionArea = Math.pow(props.nozzle, 2) * Math.PI / 8;

    // Total extrusion volume (ideal)
    const volume = sectionArea * props.length;

    // "Filament" section area
    const filamentSectionArea = Math.pow(BASE_DIAMETER / 2, 2) * Math.PI;

    // Total extrusion distance
    return volume / filamentSectionArea;
}

/**
 * Calculates rotation distance for klipper settings for a given volume and material diameter
 */
export function calculateRotationDistance(props: { volume: number, diameter: number }) {
    return props.volume / (Math.pow(props.diameter, 2) * Math.PI / 4);
}
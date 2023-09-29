/**
 * Converts feed rate from mm/sec to mm/min
 * @param src source feed
 * @returns converted feed
 */
export function convertFeed(src: number) {
    return src * 60;
}

/**
 * Convert extruder distance from syringe plunger distance to fimrware value
 * @param src plunger distance
 */
export function convertExtruderDistance(src: number) {
    return src; // Currently it is 1:1
}
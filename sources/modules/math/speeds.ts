/**
 * Computes required feed for movements in multiple directions with known feeds for each of them
 * @param src source feeds
 * @returns compound feed
 */
export function compoundFeed(...feeds: number[]) {
    if (feeds.length === 0) {
        return 0;
    }
    if (feeds.length === 1) {
        return feeds[0];
    }
    let result = 0;
    for (let v of feeds) {
        result += v * v;
    }
    return Math.sqrt(result);
}

/**
 * Multi axis feed calculation
 * NOTE: Does not work for extruder feed
 * @returns feeds for each axis
 */
export function maximumFeed(...feeds: { distance: number, speed: number }[]): number[] {

    // Corner cases
    if (feeds.length === 0) {
        throw new Error("At least one feed must be provided");
    }
    if (feeds.length === 1) {
        return [feeds[0].speed];
    }

    // Iterate to find shortest possible time as a maximum of minimum times for each axis
    let time = feeds[0].distance / feeds[0].speed;
    for (let i = 1; i < feeds.length; i++) {
        let t = Math.abs(feeds[i].distance) / feeds[i].speed; // Shortest time for axis
        time = Math.max(time, t);
    }

    // Calculate feed
    let feed: number[] = [];
    for (let f of feeds) {
        feed.push(Math.abs(f.distance) / time);
    }

    // Result
    return feed;
}

export function extrusionFeed(extrusion: number, speed: number, ...movements: { distance: number, speed: number }[]) {

    // Calculate default feed
    let feed = compoundFeed(...maximumFeed(...movements));

    // Calculate distance
    let distance = 0;
    for (let m of movements) {
        distance += m.distance * m.distance;
    }
    distance = Math.sqrt(distance);

    // Calculate time
    let time = distance / feed;

    // Calculate extrusion feed
    let extrusionFeed = Math.abs(extrusion) / time;

    // Rescale feed
    if (extrusionFeed > speed) {
        let newTime = Math.abs(extrusion) / speed;
        feed = distance / newTime;
    }

    return feed;
}
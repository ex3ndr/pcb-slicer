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
        let t = feeds[i].distance / feeds[i].speed; // Shortest time for axis
        time = Math.max(time, t);
    }

    // Calculate feed
    let feed: number[] = [];
    for (let f of feeds) {
        feed.push(f.distance / time);
    }

    // Result
    return feed;
}
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
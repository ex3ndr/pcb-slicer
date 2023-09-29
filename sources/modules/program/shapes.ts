import { Path } from "../math/Path";

export function createSquare(side: number) {
    return Path.from([
        { x: 0, y: 0 },
        { x: side, y: 0 },
        { x: side, y: side },
        { x: 0, y: side },
        { x: 0, y: 0 }
    ]);
}

export function createLine(length: number) {
    return Path.from([
        { x: 0, y: 0 },
        { x: length, y: 0 }
    ]);
}
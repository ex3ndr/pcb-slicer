// TODO: Better formatter for numbers to avoid scientific notation
export function formatNumber(src: number) {
    let r = src.toFixed(4);
    while (r.endsWith('0') && r.indexOf('.') >= 0) r = r.slice(0, r.length - 1);
    if (r.endsWith('.')) r = r.slice(0, r.length - 1);
    return r;
}
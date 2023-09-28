// TODO: Better formatter for numbers to avoid scientific notation
export function formatNumber(src: number) {
    return src.toPrecision(4);
}
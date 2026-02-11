/**
 * Привести значение к строке и trim.
 * @param {any} value
 * @returns {string}
 */
export function toTrimmedString(value) {
    return String(value ?? "").trim();
}

/**
 * Привести значение к числу.
 * Если это не число — вернуть NaN.
 * @param {any} value
 * @returns {number}
 */
export function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
}

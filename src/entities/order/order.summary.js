import {toNumber, toTrimmedString} from "./order.utils.js";

/** @typedef {import("./order.types.js").OrderItem} OrderItem */

/** @typedef {import("./order.types.js").OrderSummary} OrderSummary */

/**
 * calculateOrderSummary(items)
 *
 * Что делает:
 * - нормализует каждую позицию
 * - считает lineTotal для каждой позиции
 * - считает subtotal и total
 *
 * @param {Array<Partial<OrderItem>>} items
 * @returns {{ items: OrderItem[], summary: OrderSummary }}
 */
export function calculateOrderSummary(items) {
    const safeItems = Array.isArray(items) ? items : [];

    const normalizedItems = safeItems.map((it) => {
        const isbn = toTrimmedString(it?.isbn);
        const title = toTrimmedString(it?.title);
        const priceAtPurchase = toNumber(it?.priceAtPurchase);
        const qty = toNumber(it?.qty);

        const lineTotal =
            Number.isFinite(priceAtPurchase) && Number.isFinite(qty)
                ? priceAtPurchase * qty
                : NaN;

        return {isbn, title, priceAtPurchase, qty, lineTotal};
    });

    const subtotal = normalizedItems.reduce((sum, it) => {
        return sum + (Number.isFinite(it.lineTotal) ? it.lineTotal : 0);
    }, 0);

    const total = subtotal;

    return {items: normalizedItems, summary: {subtotal, total}};
}

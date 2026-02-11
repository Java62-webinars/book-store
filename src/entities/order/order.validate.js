import {toNumber, toTrimmedString} from "./order.utils.js";

/** @typedef {import("./order.types.js").Order} Order */

/** @typedef {import("./order.types.js").ValidationResult} ValidationResult */

/**
 * validateOrder(order)
 *
 * Проверяет, что объект заказа “можно оформить”.
 * Возвращает список ошибок (если они есть).
 *
 * @param {Partial<Order>} order
 * @returns {ValidationResult}
 */
export function validateOrder(order) {
    /** @type {string[]} */
    const errors = [];

    // 1) items
    const items = Array.isArray(order?.items) ? order.items : [];
    if (items.length === 0) {
        errors.push("Order must contain at least one item.");
    }

    // 2) buyer
    const buyerName = toTrimmedString(order?.buyer?.name);
    const buyerContact = toTrimmedString(order?.buyer?.contact);

    if (!buyerName) errors.push("Buyer name is required.");
    if (!buyerContact) errors.push("Buyer contact is required.");

    // 3) items content
    for (const [index, it] of items.entries()) {
        const isbn = toTrimmedString(it?.isbn);
        const title = toTrimmedString(it?.title);
        const price = toNumber(it?.priceAtPurchase);
        const qty = toNumber(it?.qty);

        if (!isbn) errors.push(`Item #${index + 1}: isbn is required.`);
        if (!title) errors.push(`Item #${index + 1}: title is required.`);

        if (!Number.isFinite(price) || price < 0) {
            errors.push(`Item #${index + 1}: priceAtPurchase must be a number >= 0.`);
        }

        if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty <= 0) {
            errors.push(`Item #${index + 1}: qty must be an integer > 0.`);
        }
    }

    // 4) summary (если уже есть — проверим на корректность)
    if (order?.summary) {
        const subtotal = toNumber(order.summary.subtotal);
        const total = toNumber(order.summary.total);

        if (!Number.isFinite(subtotal) || subtotal < 0) {
            errors.push("Order summary subtotal must be a number >= 0.");
        }
        if (!Number.isFinite(total) || total < 0) {
            errors.push("Order summary total must be a number >= 0.");
        }
    }

    return {ok: errors.length === 0, errors};
}

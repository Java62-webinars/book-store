import {toTrimmedString} from "./order.utils.js";
import {calculateOrderSummary} from "./order.summary.js";
import {validateOrder} from "./order.validate.js";

/** @typedef {import("./order.types.js").Order} Order */
/** @typedef {import("./order.types.js").OrderBuyer} OrderBuyer */
/** @typedef {import("./order.types.js").OrderItem} OrderItem */

/** @typedef {import("./order.types.js").CreateOrderResult} CreateOrderResult */

/**
 * createOrder({ buyer, items })
 *
 * Что делает:
 * 1) нормализует buyer (trim строк)
 * 2) считает items+summary через calculateOrderSummary(items)
 * 3) добавляет служебные поля id/createdAt/status
 * 4) валидирует итоговый order через validateOrder(order)
 *
 * Важно:
 * - не пишет в localStorage / в БД
 * - не трогает Redux
 *
 * @param {Object} params
 * @param {Partial<OrderBuyer>} params.buyer
 * @param {Array<Partial<OrderItem>>} params.items
 * @returns {CreateOrderResult}
 */
export function createOrder({buyer, items}) {
    /** @type {OrderBuyer} */
    const normalizedBuyer = {
        name: toTrimmedString(buyer?.name),
        contact: toTrimmedString(buyer?.contact),
    };

    const {items: normalizedItems, summary} = calculateOrderSummary(items);

    /** @type {Order} */
    const order = {
        id: `ord_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`,
        createdAt: Date.now(),
        status: "placed",
        buyer: normalizedBuyer,
        items: normalizedItems,
        summary,
    };

    const validation = validateOrder(order);
    if (!validation.ok) {
        return {ok: false, errors: validation.errors};
    }

    return {ok: true, order};
}

/**
 * ORDER TYPES
 */

/**
 * Позиция заказа (строка заказа).
 * priceAtPurchase фиксируется на момент оформления заказа.
 *
 * @typedef {Object} OrderItem
 * @property {string} isbn
 * @property {string} title
 * @property {number} priceAtPurchase
 * @property {number} qty
 * @property {number} lineTotal
 */

/**
 * Покупатель.
 *
 * @typedef {Object} OrderBuyer
 * @property {string} name
 * @property {string} contact
 */

/**
 * Денежные итоги заказа.
 * Доставки/скидок нет, поэтому total = subtotal.
 *
 * @typedef {Object} OrderSummary
 * @property {number} subtotal
 * @property {number} total
 */

/**
 * Заказ целиком.
 *
 * @typedef {Object} Order
 * @property {string} id
 * @property {number} createdAt
 * @property {"placed"} status
 * @property {OrderBuyer} buyer
 * @property {OrderItem[]} items
 * @property {OrderSummary} summary
 */

/**
 * Результат валидации.
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} ok
 * @property {string[]} errors
 */

/**
 * Результат createOrder: либо order, либо errors.
 *
 * @typedef {Object} CreateOrderSuccess
 * @property {true} ok
 * @property {Order} order
 *
 * @typedef {Object} CreateOrderFail
 * @property {false} ok
 * @property {string[]} errors
 *
 * @typedef {CreateOrderSuccess | CreateOrderFail} CreateOrderResult
 */

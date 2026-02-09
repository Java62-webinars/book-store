/**
 * ORDER ENTITY
 *
 * Это “чистая” логика заказа (без UI и без Redux).
 *
 * Заказ = фиксированный снимок покупки на момент оформления:
 * - buyer: кто оформил
 * - items: что купили (и по какой цене на момент покупки)
 * - summary: итоги по деньгам
 * - id/createdAt/status: служебные поля
 */

/**
 * Позиция заказа (строка в заказе).
 * Важно: priceAtPurchase фиксируется на момент оформления заказа,
 * чтобы изменение цены в каталоге не меняло старые заказы.
 *
 * @typedef {Object} OrderItem
 * @property {string} isbn - идентификатор книги (в проекте сейчас ключ — ISBN)
 * @property {string} title - название книги (снимок на момент заказа)
 * @property {number} priceAtPurchase - цена на момент заказа
 * @property {number} qty - количество
 * @property {number} lineTotal - priceAtPurchase * qty
 */

/**
 * Покупатель (минимальная версия).
 *
 * @typedef {Object} OrderBuyer
 * @property {string} name - имя/ФИО
 * @property {string} contact - телефон или email (упрощённо одним полем)
 */

/**
 * Денежные итоги заказа.
 *
 * @typedef {Object} OrderSummary
 * @property {number} subtotal - сумма по всем позициям
 * @property {number} total - итог к оплате (пока равен subtotal)
 */

/**
 * Заказ целиком.
 *
 * @typedef {Object} Order
 * @property {string} id - уникальный идентификатор заказа
 * @property {number} createdAt - timestamp (Date.now())
 * @property {"placed"} status - статус заказа (в учебной версии фиксируем как "placed")
 * @property {OrderBuyer} buyer - данные покупателя
 * @property {OrderItem[]} items - позиции заказа
 * @property {OrderSummary} summary - итоги по деньгам
 */

/**
 * Результат создания заказа:
 * - либо ok=true и order
 * - либо ok=false и errors
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

/**
 * Результат валидации заказа.
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} ok
 * @property {string[]} errors
 */

/**
 * Привести значение к строке и обрезать пробелы.
 * Нужно, чтобы null/undefined/числа не ломали дальнейшую логику.
 *
 * @param {any} value
 * @returns {string}
 */


/**
 * Привести значение к числу.
 * Если это не число — вернуть NaN (потом проверяем Number.isFinite()).
 *
 * @param {any} value
 * @returns {number}
 */


/**
 * calculateOrderSummary(items)
 *
 * Что делает:
 * 1) нормализует каждую позицию (isbn/title/priceAtPurchase/qty)
 * 2) считает lineTotal для каждой позиции
 * 3) считает subtotal и total
 *
 * Зачем:
 * - чтобы денежные расчёты были в одном месте
 * - чтобы их было легко тестировать
 *
 * @param {Array<Partial<OrderItem>>} items
 * @returns {{ items: OrderItem[], summary: OrderSummary }}
 */

/**
 * validateOrder(order)
 *
 * Проверки (бизнес-правила):
 * - items не пустой
 * - buyer.name и buyer.contact заполнены
 * - каждая позиция корректна:
 *   - isbn/title не пустые
 *   - priceAtPurchase число >= 0
 *   - qty целое число > 0
 * - если summary есть — subtotal/total корректные числа >= 0
 *
 * @param {Partial<Order>} order
 * @returns {ValidationResult}
 */


/**
 * createOrder({ buyer, items })
 *
 * Что делает:
 * - нормализует buyer
 * - пересчитывает items+summary через calculateOrderSummary
 * - добавляет служебные поля (id/createdAt/status)
 * - валидирует заказ validateOrder
 *
 * Важно:
 * - createOrder НЕ пишет в localStorage
 * - createOrder НЕ трогает Redux
 * - это чистая функция “собери и проверь заказ”
 *
 * @param {Object} params
 * @param {Partial<OrderBuyer>} params.buyer
 * @param {Array<Partial<OrderItem>>} params.items
 * @returns {CreateOrderResult}
 */

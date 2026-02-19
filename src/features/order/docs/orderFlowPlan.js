/**
 * @fileoverview Order flow plan (Book-Store)
 *
 * Цель:
 * Заказ (Order) формируется ТОЛЬКО из валидных позиций корзины:
 * - книга существует в каталоге (ISBN найден)
 * - книга не снята с продажи (flagOutOfStock !== true)
 *
 * Ключевая опора:
 * entities/cart/classifyCartAgainstCatalog(cartItems, catalogItems)
 * → делит корзину на valid и invalid.
 */

/**
 * @typedef {Object} CartItem
 * @property {string} isbn
 * @property {number} quantity
 */

/**
 * @typedef {Object} Book
 * @property {string} isbn
 * @property {string} title
 * @property {number} price
 * @property {boolean} flagOutOfStock
 */

/**
 * @typedef {"MISSING"|"OUT_OF_STOCK"} InvalidReason
 * Причина, почему позиция корзины не может попасть в заказ:
 * - "MISSING" — книги нет в каталоге
 * - "OUT_OF_STOCK" — книга снята с продажи / out of stock
 */

/**
 * @typedef {Object} InvalidCartPosition
 * @property {CartItem} cartItem
 * @property {InvalidReason} reason
 * @property {Book=} book
 * Если reason="OUT_OF_STOCK", book обычно есть (мы нашли книгу, но она outOfStock).
 * Если reason="MISSING", book нет.
 */

/**
 * @typedef {Object} ValidCartPosition
 * @property {CartItem} cartItem
 * @property {Book} book
 */

/**
 * @typedef {Object} CartClassification
 * @property {ValidCartPosition[]} valid
 * @property {InvalidCartPosition[]} invalid
 */

/**
 * @typedef {Object} OrderItem
 * Снимок позиции на момент оформления заказа (важно: цена фиксируется как priceAtPurchase).
 * @property {string} isbn
 * @property {string} title
 * @property {number} priceAtPurchase
 * @property {number} qty
 */

/**
 * @typedef {Object} OrderSummary
 * @property {number} itemsCount
 * @property {number} totalQty
 * @property {number} totalPrice
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} createdAt
 * @property {OrderItem[]} items
 * @property {OrderSummary} summary
 * @property {Object=} meta
 * @property {InvalidCartPosition[]=} meta.excludedItems
 * Опционально: сохранить список исключённых позиций, чтобы UI мог показать предупреждение.
 */

/**
 * @typedef {"strict"|"soft"} OrderValidationMode
 * Режим поведения при наличии invalid-позиций:
 * - "strict": если invalid.length > 0 → заказ НЕ создаём, показываем ошибку
 * - "soft": заказ создаём из valid, invalid исключаем, показываем предупреждение
 */

/**
 * @typedef {Object} OrderSliceState
 * Минимальная модель состояния (Redux):
 * @property {Order|null} lastOrder
 * @property {string|null} info
 * @property {string|null} warning
 * @property {string|null} error
 * @property {Order[]=} orders
 * Если хотите историю заказов — храните orders[] вместо lastOrder (или вместе).
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 0. Договориться о поведении (что делаем с invalid)
 * ---------------------------------------------------------------------------
 *
 * @step 0
 * @name DefineInvalidPolicy
 * @description
 * Зафиксировать OrderValidationMode:
 * - strict: наличие invalid блокирует оформление
 * - soft: invalid исключаются из заказа, но показывается предупреждение
 *
 * @acceptanceCriteria
 * - Явно выбран режим (strict/soft) и это отражено в use-case/thunk.
 * - Сценарий "все позиции invalid" приводит к отказу от создания заказа в любом режиме.
 *
 * @notes
 * - Ваше требование "заказ должен формироваться только из валидных" полностью выполняется в обоих режимах,
 *   но UX отличается.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 1. Развести слои ответственности (entity vs use-case/thunk)
 * ---------------------------------------------------------------------------
 *
 * @step 1
 * @name SplitResponsibilities
 * @description
 * Разделить зоны ответственности:
 * - entities/order/*: чистые функции для Order (структура, подсчёт summary, валидация структуры)
 * - feature/app (thunk/use-case): доступ к Redux state, классификация cart vs catalog, сборка orderItems
 *
 * @acceptanceCriteria
 * - Order-entity не читает Redux и не знает про catalogSlice/cartSlice напрямую.
 * - Вся логика "найти книгу" и "проверить outOfStock" живёт в слое use-case/thunk через classifyCartAgainstCatalog.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 2. Ввести use-case подготовки позиций заказа
 * ---------------------------------------------------------------------------
 *
 * @step 2
 * @name BuildOrderItemsUseCase
 * @description
 * Создать логическую операцию (use-case), которая:
 * - принимает cartItems и catalogBooks
 * - вызывает classifyCartAgainstCatalog
 * - возвращает:
 *   - orderItems[] (только из valid)
 *   - invalid[] (исключённые позиции + причины)
 *
 * @input {CartItem[]} cartItems
 * @input {Book[]} catalogBooks
 * @output {Object} result
 * @output {OrderItem[]} result.orderItems
 * @output {InvalidCartPosition[]} result.invalid
 *
 * @acceptanceCriteria
 * - В orderItems нет позиций MISSING и OUT_OF_STOCK.
 * - invalid корректно содержит причины исключения.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 3. Правила преобразования valid → OrderItem (снимок покупки)
 * ---------------------------------------------------------------------------
 *
 * @step 3
 * @name MapValidToOrderItem
 * @description
 * Для каждой валидной позиции (cartItem + book) формируем OrderItem:
 * - isbn = book.isbn (или cartItem.isbn при совпадении)
 * - title = book.title
 * - priceAtPurchase = book.price (фиксируем цену на момент покупки)
 * - qty = cartItem.quantity
 *
 * @acceptanceCriteria
 * - priceAtPurchase берётся из catalog на момент оформления (не из каких-либо старых данных).
 * - qty проходит базовую валидацию (целое число >= 1).
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 4. Добавить feature order (минимально, без UI)
 * ---------------------------------------------------------------------------
 *
 * @step 4
 * @name IntroduceOrderFeature
 * @description
 * Ввести orderSlice (или эквивалент), чтобы хранить:
 * - lastOrder (или orders[])
 * - info/warning/error
 *
 * @stateShape {OrderSliceState}
 *
 * @acceptanceCriteria
 * - Есть место в store, куда положить результат оформления.
 * - Есть поля для сообщения об ошибке и предупреждения.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 5. Thunk placeOrderFromCart (основной поток)
 * ---------------------------------------------------------------------------
 *
 * @step 5
 * @name PlaceOrderFromCartThunk
 * @description
 * Реализовать thunk, который:
 * 1) читает cartItems из state.cart
 * 2) читает books из state.catalog
 * 3) классифицирует (valid/invalid)
 * 4) собирает orderItems из valid
 * 5) если orderItems пустой → error и прекращаем
 * 6) создаёт Order через createOrder(...)
 * 7) кладёт Order в store
 * 8) обрабатывает invalid:
 *    - strict: если invalid.length > 0 → error, заказа нет
 *    - soft: warning + (опционально) meta.excludedItems
 *
 * @acceptanceCriteria
 * - Заказ никогда не содержит invalid-позиций.
 * - Поведение при invalid соответствует выбранному OrderValidationMode.
 * - При отсутствии valid-позиций заказ не создаётся.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 6. Судьба корзины после оформления
 * ---------------------------------------------------------------------------
 *
 * @step 6
 * @name PostCheckoutCartPolicy
 * @description
 * Определить политику очистки корзины после успешного оформления:
 * - "clearAll": очистить всю корзину
 * - "clearValidOnly": удалить из корзины только те позиции, что ушли в заказ,
 *    оставив invalid, чтобы пользователь мог увидеть проблему
 *
 * @acceptanceCriteria
 * - Политика определена и выполняется стабильно.
 * - При "clearValidOnly" invalid позиции остаются, и пользователь видит причины (через UI/сообщения).
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 7. Минимальные состояния UI (пока только спецификация)
 * ---------------------------------------------------------------------------
 *
 * @step 7
 * @name DefineUIStates
 * @description
 * Спроектировать состояния, которые UI должен уметь показать:
 * - error: "нечего оформлять" / "в корзине невалидные позиции" (strict)
 * - warning: "исключено N позиций" (soft)
 * - success: "заказ создан"
 *
 * @acceptanceCriteria
 * - orderSliceState содержит достаточно информации, чтобы UI отрисовал:
 *   success/error/warning без дополнительной логики в компонентах.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 8. Тесты (unit + integration)
 * ---------------------------------------------------------------------------
 *
 * @step 8
 * @name TestingPlan
 * @description
 * Покрыть тестами ключевые сценарии:
 * - unit: use-case подготовки orderItems (валидные/невалидные)
 * - integration: thunk placeOrderFromCart
 *
 * @testCases
 * - MISSING: cartItem.isbn не найден в catalog → invalid reason=MISSING, orderItems без этой позиции
 * - OUT_OF_STOCK: book.flagOutOfStock=true → invalid reason=OUT_OF_STOCK, orderItems без этой позиции
 * - MIX: часть valid, часть invalid → orderItems только valid; warning/behavior по режиму
 * - ALL_INVALID: valid=0 → заказ не создаётся, error установлен
 *
 * @acceptanceCriteria
 * - Тесты проверяют именно "заказ не содержит invalid".
 * - Тесты фиксируют различие strict vs soft.
 */

/**
 * ---------------------------------------------------------------------------
 * ШАГ 9. Persistence заказов (опционально)
 * ---------------------------------------------------------------------------
 *
 * @step 9
 * @name PersistOrdersOptional
 * @description
 * Если нужно сохранять заказы:
 * - orderStorage: saveOrdersToStorage / loadOrdersFromStorage
 * - загрузка при старте (hydrate order slice)
 *
 * @acceptanceCriteria
 * - Перезагрузка страницы не теряет историю заказов (если включили orders[]).
 * - Формат в storage устойчив к ошибочным данным (валидация при загрузке).
 */

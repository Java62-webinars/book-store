/** @param {any} state */
export const selectCartState = (state) => state.cart;
// -------------------------
// Direct selectors
// -------------------------

/** @param {any} state */
export const selectCartInfo = (state) => selectCartState(state).info;
/** @param {any} state */
export const selectCartError = (state) => selectCartState(state).error;
/** @param {any} state */
export const selectCartItems = (state) => selectCartState(state).cartItems;
// -------------------------
// Derived selectors (простые итоги)
// -------------------------

/**
 * Сколько уникальных ISBN лежит в корзине.
 * (Т.е. количество строк корзины / позиций.)
 *
 * @param {any} state
 */
export const selectCartUniqueISBN = (state) => selectCartItems(state).length;

/**
 * Общее количество книг (сумма quantity по всем позициям).
 *
 * @param {any} state
 */
export const selectCartTotalBooks = (state) =>
    selectCartItems(state).reduce((sum, cartItem) => sum + cartItem.quantity, 0);

/**
 * Возвращает cartItem по ISBN или undefined, если его нет.
 *
 * @param {any} state
 * @param {string|number} isbn
 */
export const selectCartItemByISBN = (state, isbn) =>
    selectCartItems(state).find((item) => item.isbn === isbn);

/**
 * Сводные итоги корзины (удобно для бейджа в шапке и "итого" на экране корзины).
 *
 * @param {any} state
 * @returns {{uniqueISBN:number,totalBooks:number}}
 */
export const selectCartTotals = (state) => ({
    uniqueISBN: selectCartUniqueISBN(state),
    totalBooks: selectCartTotalBooks(state),
});

// -------------------------
// Derived selectors (join с каталогом)
// -------------------------

/**
 * Пытаемся получить каталог. Если в store пока нет catalog (теоретически),
 * вернём пустой массив, чтобы селектор оставался безопасным.
 *
 * @param {any} state
 * @returns {Array<any>}
 */
const safeSelectCatalogItems = (state) =>
    state?.catalog?.items ? state.catalog.items : [];

/**
 * Детализированный список для UI корзины:
 * - берём cartItems (isbn, quantity)
 * - подтягиваем из каталога title/author/price/flagOutOfStock
 * - считаем lineTotal = price * quantity
 *
 * Если книги нет в каталоге (редкий кейс) — возвращаем fallback поля.
 *
 * @param {any} state
 * @returns {Array<{isbn:any, quantity:number, title:string, author:string, price:number, flagOutOfStock:boolean, lineTotal:number, book?:any}>}
 */
export const selectCartDetailedItems = (state) => {
    const cartItems = selectCartItems(state);
    const catalogItems = safeSelectCatalogItems(state);

    return cartItems.map((cartItem) => {
        const book = catalogItems.find((b) => b.isbn === cartItem.isbn);

        const title = book?.title ?? "";
        const author = book?.author ?? "";
        const price =
            typeof book?.price === "number" ? book.price : Number(book?.price ?? 0);
        const flagOutOfStock = Boolean(book?.flagOutOfStock);

        return {
            isbn: cartItem.isbn,
            quantity: cartItem.quantity,
            title,
            author,
            price,
            flagOutOfStock,
            lineTotal: price * cartItem.quantity,
            // опционально — если UI нужно показать всю книгу целиком
            book,
        };
    });
};

/**
 * Общая стоимость корзины (с учётом quantity).
 *
 * @param {any} state
 * @returns {number}
 */
export const selectCartTotalPrice = (state) =>
    selectCartDetailedItems(state).reduce((sum, item) => sum + item.lineTotal, 0);
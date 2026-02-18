/**
 * Классифицирует позиции корзины относительно каталога.
 *
 * Правило проекта:
 * - корзина хранит позиции как есть (isbn, quantity)
 * - но при расчётах/выводе мы должны уметь понимать, что строка "невалидна":
 *   1) книги больше нет в каталоге (например, ISBN изменили или книгу удалили)
 *   2) книга есть, но снята с продажи (flagOutOfStock=true)
 *
 * @param {Array<{isbn:any, quantity:number}>} cartItems
 * @param {Array<{isbn:any, flagOutOfStock?:boolean}>} catalogItems
 * @returns {{
 *  valid: Array<{cartItem:any, book:any}>,
 *  invalid: Array<{cartItem:any, book:any, reason:"MISSING"|"OUT_OF_STOCK"}>
 * }}
 */
export function classifyCartAgainstCatalog(cartItems, catalogItems) {
    const valid = [];
    const invalid = [];

    const safeCart = Array.isArray(cartItems) ? cartItems : [];
    const safeCatalog = Array.isArray(catalogItems) ? catalogItems : [];

    for (const cartItem of safeCart) {
        const book = safeCatalog.find((b) => b?.isbn === cartItem?.isbn);

        if (!book) {
            invalid.push({cartItem, book: null, reason: "MISSING"});
            continue;
        }

        if (book.flagOutOfStock) {
            invalid.push({cartItem, book, reason: "OUT_OF_STOCK"});
            continue;
        }

        valid.push({cartItem, book});
    }

    return {valid, invalid};
}

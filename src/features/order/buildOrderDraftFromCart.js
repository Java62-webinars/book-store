import {classifyCartAgainstCatalog} from "../../entities/cart/classifyCartAgainstCatalog.js";

export function buildOrderDraftFromCart(cartItems, catalogBooks) {
    const {valid, invalid} = classifyCartAgainstCatalog(cartItems, catalogBooks);
    const items = valid.map(({cartItem, book}) => {
        const qty = Number(cartItem?.quantity);
        const priceAtPurchase = Number(book?.price);
        const lineTotal = priceAtPurchase * qty;
        return {
            isbn: cartItem.isbn,
            title: book.title,
            priceAtPurchase,
            qty,
            lineTotal,
        };
    });
    return {items, excluded: invalid};
}
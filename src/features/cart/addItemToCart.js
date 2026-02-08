import {addItem, clearCartMessages, setCartError} from "./cartSlice.js";

export function addItemToCart(isbn) {
    return (dispatch, getState) => {
        dispatch(clearCartMessages());

        const normalizedIsbn = String(isbn ?? "").trim();
        if (!normalizedIsbn) {
            dispatch(setCartError("ISBN is required"));
            return;
        }

        const state = getState();
        const books = state.catalog?.items ?? [];

        const book = books.find((b) => b.isbn === normalizedIsbn);
        if (!book) {
            dispatch(setCartError("Book not found in catalog"));
            return;
        }

        if (book.flagOutOfStock) {
            dispatch(setCartError("Book is out of stock"));
            return;
        }

        dispatch(addItem(normalizedIsbn));
    };
}

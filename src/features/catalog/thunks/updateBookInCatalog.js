import {setError, updateBookByIsbn} from "../catalogSlice.js";
import {isValidBook} from "../../../entities/book/book.validators.js";
import {saveCatalogToStorage} from "../catalogStorage.js";
import {updateBookRequest} from "../../../api/api.js";

export function updateBookInCatalog(payload) {
    return async (dispatch, getState) => {
        const originalIsbn = String(payload?.originalIsbn ?? "");

        if (!originalIsbn) {
            dispatch(setError("ISBN is required"));
            return;
        }

        const {items} = getState().catalog;
        const existing = items.find((b) => b.isbn === originalIsbn);

        if (!existing) {
            dispatch(setError("Book with ISBN not found"));
            return;
        }

        const next = {
            title: String(payload.title ?? "").trim(),
            author: String(payload.author ?? "").trim(),
            isbn: String(payload.isbn ?? "").trim(),
            price: Number(payload.price),
        };

        const validation = isValidBook({
            ...next,
            flagOutOfStock: existing.flagOutOfStock,
        });

        if (!validation.valid) {
            dispatch(setError(validation.error));
            return;
        }

        try {
            const updatedBook = await updateBookRequest(originalIsbn, next);

            dispatch(updateBookByIsbn({
                originalIsbn,
                next: updatedBook,
            }));

            saveCatalogToStorage(getState().catalog.items);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };
}
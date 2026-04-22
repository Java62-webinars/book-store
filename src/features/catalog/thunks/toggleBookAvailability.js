import {setError, updateBookByIsbn} from "../catalogSlice.js";
import {saveCatalogToStorage} from "../catalogStorage.js";
import {changeAvailabilityRequest} from "../../../api/api.js";

export function toggleBookAvailability(isbn) {
    return async (dispatch, getState) => {
        const {items} = getState().catalog;
        const existing = items.find((book) => book.isbn === isbn);

        if (!existing) {
            dispatch(setError("Book with isbn not found"));
            return;
        }

        const nextFlag = !existing.flagOutOfStock;

        try {
            const updatedBook = await changeAvailabilityRequest(isbn, nextFlag);

            dispatch(updateBookByIsbn({
                originalIsbn: isbn,
                next: updatedBook,
            }));

            saveCatalogToStorage(getState().catalog.items);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };
}
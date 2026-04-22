import {createBook} from "../../../entities/book/book.js";
import {isValidBook} from "../../../entities/book/book.validators.js";
import {addBook, setError} from "../catalogSlice.js";
import {saveCatalogToStorage} from "../catalogStorage.js";
import {createBookRequest} from "../../../api/api.js";

export function addBookToCatalog(rawBook) {
    return async (dispatch, getState) => {
        const book = createBook(rawBook);
        const validation = isValidBook(book);

        if (!validation.valid) {
            dispatch(setError(validation.error));
            return;
        }

        try {
            const createdBook = await createBookRequest(book);

            dispatch(addBook(createdBook));
            saveCatalogToStorage(getState().catalog.items);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };
}
import {saveCatalogToStorage} from "../catalogStorage.js";
import {setCatalog} from "../catalogSlice.js";
//import {initBooks} from "../catalogSeed.js";
import {hydrateCatalog} from "../hydrateCatalog.js";
import {fetchBooks} from "../../../api/api.js";

export function loadCatalog(){
    return async (dispatch) => {
        // const storedData = loadCatalogFromStorage();
        // const hydratedBooksFromStoredData = hydrateCatalog(storedData);
        // if(hydratedBooksFromStoredData.books.length > 0) {
        //     console.log("From Storage", hydratedBooksFromStoredData);
        //     saveCatalogToStorage(hydratedBooksFromStoredData.books);
        //     dispatch(setCatalog(hydratedBooksFromStoredData.books));
        //     return;
        // }
        // const hydratedBooksFromSeed = hydrateCatalog (initBooks);
        // saveCatalogToStorage(hydratedBooksFromSeed.books);
        // dispatch(setCatalog(hydratedBooksFromSeed.books));
        // console.log("From JSON", hydratedBooksFromSeed.books);
        try {
            const serverBooks = await fetchBooks();
            const hydratedBooksFromServer = hydrateCatalog(serverBooks);
            saveCatalogToStorage(hydratedBooksFromServer.books);
            dispatch(setCatalog(hydratedBooksFromServer.books));
            console.log("From Server", hydratedBooksFromServer.books);
        } catch (e) {
            console.error(e);
        }
    }
}
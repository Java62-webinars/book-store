import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {loadCatalog} from "../../features/catalog/catalogThunks.js";
import {selectCatalogInfo, selectCatalogItems,} from "../../features/catalog/catalogSelectors.js";

import AddBookScreen from "./AddBookScreen.jsx";
import BookItem from "./BookItem.jsx";

function CatalogScreen() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadCatalog());
    }, [dispatch]);

    const items = useSelector(selectCatalogItems);
    const info = useSelector(selectCatalogInfo);

    return (
        <div className="relative">
            <div className="mb-6">
                <AddBookScreen/>
                {info ? <p className="mt-2 text-sm text-gray-700">{info}</p> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((book) => (
                    <BookItem key={book.isbn} book={book}/>
                ))}
            </div>
        </div>
    );
}

export default CatalogScreen;
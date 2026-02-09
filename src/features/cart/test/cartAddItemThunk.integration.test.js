import {describe, expect, it} from "vitest";
import {configureStore} from "@reduxjs/toolkit";

import {cartReducer} from "../cartSlice.js";
import {addItemToCart} from "../addItemToCart.js";
import {catalogReducer} from "../../catalog/catalogSlice.js";


function makeStoreWithCatalogItems(catalogItems) {
    return configureStore({
        reducer: {
            cart: cartReducer,
            catalog: catalogReducer,
        },
        // Мы задаём реальный начальный state каталога через preloadedState,
        // чтобы не зависеть от экшенов каталога (setCatalog и т.п.)
        preloadedState: {
            catalog: {
                items: catalogItems,
                info: null,
                error: null,
            },
        },
    });
}

describe("addItemToCart integration (real store + real reducers + thunk)", () => {
    it("adds item to cart when book exists and in stock", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "9780140449136", flagOutOfStock: false},
            {isbn: "9780679783268", flagOutOfStock: false},
        ]);

        // Диспатчим thunk как в реальном приложении
        store.dispatch(addItemToCart("9780140449136"));

        const state = store.getState();

        // Проверяем итоговый state корзины
        expect(state.cart.cartItems).toEqual([{isbn: "9780140449136", quantity: 1}]);
        expect(state.cart.error).toBe(null);
    });

    it("trims isbn and still adds item", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "9780140449136", flagOutOfStock: false},
        ]);

        store.dispatch(addItemToCart(" 9780140449136 "));

        const state = store.getState();
        expect(state.cart.cartItems).toEqual([{isbn: "9780140449136", quantity: 1}]);
        expect(state.cart.error).toBe(null);
    });

    it("does not add item and sets error when book not found in catalog", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "111", flagOutOfStock: false},
        ]);

        store.dispatch(addItemToCart("999"));

        const state = store.getState();
        expect(state.cart.cartItems).toEqual([]);
        expect(state.cart.error).toBe("Book not found in catalog");
    });

    it("does not add item and sets error when book is out of stock", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "9780140449136", flagOutOfStock: true},
        ]);

        store.dispatch(addItemToCart("9780140449136"));

        const state = store.getState();
        expect(state.cart.cartItems).toEqual([]);
        expect(state.cart.error).toBe("Book is out of stock");
    });
});

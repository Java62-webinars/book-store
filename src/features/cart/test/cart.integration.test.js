import {describe, expect, it} from "vitest";
import {
    selectCartDetailedItems,
    selectCartError,
    selectCartInfo,
    selectCartState,
    selectCartTotalBooks,
    selectCartTotalPrice,
    selectCartTotals,
    selectCartUniqueISBN,
} from "../cartSelectors.js";
import {configureStore} from "@reduxjs/toolkit";
import {addItem, cartReducer, changeQuantity} from "../cartSlice.js";
import {addItemToCart} from "../addItemToCart.js";
import {catalogReducer} from "../../catalog/catalogSlice.js";

describe("cart integration (store + slice + selectors)", () => {
    it("updates real store state and selectors read correct values", () => {
        const store = configureStore({
            reducer: {
                cart: cartReducer,
            }
        });
        expect(selectCartState(store.getState())).toEqual({
            cartItems: [],
            info: null,
            error: null,
        });

        store.dispatch(addItem("978978978978"));
        expect(selectCartTotalBooks(store.getState())).toEqual(1);
        store.dispatch(addItem("978978978978", 10));
        expect(selectCartTotalBooks(store.getState())).toEqual(2);
        store.dispatch(changeQuantity({isbn: "978978978978", newQuantity: 10}));
        expect(selectCartTotalBooks(store.getState())).toEqual(10);
        expect(selectCartError(store.getState())).toBeNull();
        expect(selectCartInfo(store.getState())).toEqual("quantity updated");
        store.dispatch(addItem("978978978888"));
        expect(selectCartUniqueISBN(store.getState())).toEqual(2)
    })

});

function makeStoreWithCatalogItems(catalogItems) {
    return configureStore({
        reducer: {
            cart: cartReducer,
            catalog: catalogReducer,
        },
        preloadedState: {
            catalog: {
                items: catalogItems,
                info: null,
                error: null,
            },
            // cart slice сам создаст дефолтный initial state
        },
    });
}

describe("cart selectors integration (real store + real reducers + thunk)", () => {
    it("selectCartDetailedItems joins catalog + cart and computes line totals and total price", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "111", title: "Book 1", author: "A1", price: 10, flagOutOfStock: false},
            // price как строка — селектор должен привести к number
            {isbn: "222", title: "Book 2", author: "A2", price: "7", flagOutOfStock: false},
        ]);

        // Добавляем 2 позиции в корзину через thunk (как в реальном приложении)
        store.dispatch(addItemToCart("111"));
        store.dispatch(addItemToCart("222"));

        // Меняем количество одной позиции через slice-экшен
        store.dispatch(changeQuantity({isbn: "222", newQuantity: 3}));

        // Проверяем "корзинный бейдж" (итоги)
        expect(selectCartTotals(store.getState())).toEqual({uniqueISBN: 2, totalBooks: 4});

        // Проверяем join + расчёты
        expect(selectCartDetailedItems(store.getState())).toEqual([
            {
                isbn: "111",
                quantity: 1,
                title: "Book 1",
                author: "A1",
                price: 10,
                flagOutOfStock: false,
                lineTotal: 10,
                book: {isbn: "111", title: "Book 1", author: "A1", price: 10, flagOutOfStock: false},
            },
            {
                isbn: "222",
                quantity: 3,
                title: "Book 2",
                author: "A2",
                price: 7,
                flagOutOfStock: false,
                lineTotal: 21,
                book: {isbn: "222", title: "Book 2", author: "A2", price: "7", flagOutOfStock: false},
            },
        ]);

        expect(selectCartTotalPrice(store.getState())).toBe(31);
    });

    it("does not include out-of-stock book when thunk blocks it", () => {
        const store = makeStoreWithCatalogItems([
            {isbn: "111", title: "Book 1", author: "A1", price: 10, flagOutOfStock: true},
            {isbn: "222", title: "Book 2", author: "A2", price: 5, flagOutOfStock: false},
        ]);

        store.dispatch(addItemToCart("111")); // out of stock -> не добавится
        store.dispatch(addItemToCart("222")); // добавится

        expect(selectCartDetailedItems(store.getState())).toEqual([
            {
                isbn: "222",
                quantity: 1,
                title: "Book 2",
                author: "A2",
                price: 5,
                flagOutOfStock: false,
                lineTotal: 5,
                book: {isbn: "222", title: "Book 2", author: "A2", price: 5, flagOutOfStock: false},
            },
        ]);

        expect(selectCartTotals(store.getState())).toEqual({uniqueISBN: 1, totalBooks: 1});
        expect(selectCartTotalPrice(store.getState())).toBe(5);
    });
});
import {beforeEach, describe, expect, it, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";

import {cartReducer, changeQuantity} from "../cartSlice.js";
import {catalogReducer} from "../../catalog/catalogSlice.js";
import {addItemToCart} from "../addItemToCart.js";

import {cartPersistenceListenerMiddleware} from "../cartPersistenceListenerMiddleware.js";
import {loadCart} from "../loadCart.js";
import {STORAGE_KEYS} from "../../../constants/storageKeys.js";

/**
 * In-memory localStorage mock.
 * Нужен потому что storageClient использует localStorage.getItem/setItem/removeItem.
 */
function makeLocalStorageMock() {
    let data = {};
    const removeStacks = [];

    return {
        getItem: vi.fn((k) => (k in data ? data[k] : null)),
        setItem: vi.fn((k, v) => {
            data[k] = String(v);
        }),
        removeItem: vi.fn((k) => {
            removeStacks.push({key: k, stack: new Error("removeItem stack").stack});
            delete data[k];
        }),
        clear: vi.fn(() => {
            data = {};
            removeStacks.length = 0;
        }),

        //  даём доступ к собранным стекам
        _removeStacks: () => removeStacks.slice(),
    };
}

function makeStore(preloadedState) {
    return configureStore({
        reducer: {
            catalog: catalogReducer,
            cart: cartReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cartPersistenceListenerMiddleware),
        preloadedState,
    });
}

describe("cart localStorage integration: hydrate + middleware persistence", () => {
    beforeEach(() => {
        // Важно: storageClient читает globalThis.localStorage
        // @ts-ignore
        globalThis.localStorage = makeLocalStorageMock();
    });

    it("hydrate: loadCart() puts only valid items into state", () => {
        localStorage.setItem(
            STORAGE_KEYS.CART,
            JSON.stringify([
                {isbn: "111", quantity: 2},   // ok
                {isbn: "", quantity: 3},      // invalid
                {isbn: "222", quantity: -1},  // invalid
                {isbn: "333", quantity: 1},   // ok
            ])
        );

        const store = makeStore();

        store.dispatch(loadCart());

        expect(store.getState().cart.cartItems).toEqual([
            {isbn: "111", quantity: 2},
            {isbn: "333", quantity: 1},
        ]);
    });

    it("middleware: saves cart when cart changes, and does NOT save when only catalog actions dispatch", () => {
        const store = makeStore({
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                ],
                info: null,
                error: null,
            },
        });

        // 1) dispatch в каталог — listener должен проигнорировать (не cart/*)
        store.dispatch({type: "catalog/TEST_NOOP"});
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);

        // 2) добавляем книгу в cart (thunk) — будет запись
        store.dispatch(addItemToCart("111"));
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);

        const saved1 = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART));
        expect(saved1).toEqual([{isbn: "111", quantity: 1}]);

        // 3) меняем количество — снова сохранение
        store.dispatch(changeQuantity({isbn: "111", newQuantity: 3}));
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);

        const saved2 = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART));
        expect(saved2).toEqual([{isbn: "111", quantity: 3}]);
    });

    it("middleware: removes key when cart becomes empty", async () => {
        const store = makeStore({
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                ],
                info: null,
                error: null,
            },
        });

        store.dispatch(addItemToCart("111"));
        expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.CART))).toEqual([{isbn: "111", quantity: 1}]);

        store.dispatch(changeQuantity({isbn: "111", newQuantity: 0}));

        // дать listener’у завершить effect (в watch это важно)
        await Promise.resolve();

        const removedKeys = localStorage.removeItem.mock.calls.map(([k]) => k);
        expect(removedKeys).toContain(STORAGE_KEYS.CART);
        expect(localStorage.getItem(STORAGE_KEYS.CART)).toBeNull();
    });

    it("round-trip: store A saves cart to localStorage, store B restores it via loadCart()", () => {
        // --- STORE A
        const storeA = makeStore({
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                    {isbn: "222", title: "B2", author: "A2", price: 5, flagOutOfStock: false},
                ],
                info: null,
                error: null,
            },
        });

        storeA.dispatch(addItemToCart("111"));
        storeA.dispatch(addItemToCart("222"));
        storeA.dispatch(changeQuantity({isbn: "111", newQuantity: 3}));

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART));
        expect(saved).toEqual([
            {isbn: "111", quantity: 3},
            {isbn: "222", quantity: 1},
        ]);

        // --- STORE B
        const storeB = makeStore();
        storeB.dispatch(loadCart());

        expect(storeB.getState().cart.cartItems).toEqual([
            {isbn: "111", quantity: 3},
            {isbn: "222", quantity: 1},
        ]);
    });
});

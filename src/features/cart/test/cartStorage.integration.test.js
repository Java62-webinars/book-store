import {beforeEach, describe, expect, it, vi} from "vitest";
import {configureStore} from "@reduxjs/toolkit";

import {cartReducer, changeQuantity} from "../cartSlice.js";
import {catalogReducer} from "../../catalog/catalogSlice.js";
import {addItemToCart} from "../addItemToCart.js";

import {attachCartPersistence} from "../cartPersistence.js";
import {loadCart} from "../loadCart.js";
import {STORAGE_KEYS} from "../../../constants/storageKeys.js";

/**
 * In-memory localStorage mock.
 * Нужен потому что storageClient использует localStorage.getItem/setItem/removeItem.
 */
function makeLocalStorageMock() {
    let data = {};
    return {
        getItem: vi.fn((k) => (k in data ? data[k] : null)),
        setItem: vi.fn((k, v) => {
            data[k] = String(v);
        }),
        removeItem: vi.fn((k) => {
            delete data[k];
        }),
        clear: vi.fn(() => {
            data = {};
        }),
        _dump: () => ({...data}),
    };
}

function makeStore(preloadedState) {
    return configureStore({
        reducer: {
            catalog: catalogReducer,
            cart: cartReducer,
        },
        preloadedState,
    });
}

describe("cart localStorage integration: hydrate + subscribe persistence", () => {
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

    it("subscribe: saves cart when cart changes, and does NOT save when only catalog actions dispatch", () => {
        const store = makeStore({
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                ],
                info: null,
                error: null,
            },
        });

        attachCartPersistence(store);

        // 1) dispatch в каталог (любой action) — subscribe сработает, но cart не менялся
        store.dispatch({type: "catalog/TEST_NOOP"});
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);

        // 2) добавляем книгу в cart (thunk)
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

    it("subscribe: removes key when cart becomes empty", () => {
        const store = makeStore({
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                ],
                info: null,
                error: null,
            },
        });

        attachCartPersistence(store);

        store.dispatch(addItemToCart("111"));
        expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.CART))).toEqual([
            {isbn: "111", quantity: 1},
        ]);

        // newQuantity=0 → твой reducer удаляет item (как в текущей логике)
        store.dispatch(changeQuantity({isbn: "111", newQuantity: 0}));

        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem(STORAGE_KEYS.CART)).toBeNull();
    });
    it("round-trip: store A saves cart to localStorage, store B restores it via loadCart()", () => {
        // --- STORE A: добавляем в корзину и убеждаемся, что данные ушли в localStorage
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

        attachCartPersistence(storeA);

        // Добавим 2 книги
        storeA.dispatch(addItemToCart("111"));
        storeA.dispatch(addItemToCart("222"));

        // Изменим количество одной
        storeA.dispatch(changeQuantity({isbn: "111", newQuantity: 3}));

        // Проверяем: localStorage содержит итоговую корзину
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART));
        expect(saved).toEqual([
            {isbn: "111", quantity: 3},
            {isbn: "222", quantity: 1},
        ]);

        // --- STORE B: "новый запуск приложения"
        const storeB = makeStore();

        // На старте приложения вызывается гидратация
        storeB.dispatch(loadCart());

        // Проверяем: корзина восстановилась из localStorage
        expect(storeB.getState().cart.cartItems).toEqual([
            {isbn: "111", quantity: 3},
            {isbn: "222", quantity: 1},
        ]);
    });

});

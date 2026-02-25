import {describe, expect, it} from "vitest";
import {configureStore} from "@reduxjs/toolkit";

import {catalogReducer} from "../../catalog/catalogSlice.js";
import {cartReducer} from "../../cart/cartSlice.js";
import {orderReducer} from "../orderSlice.js";
import {placeOrderFromCart} from "../placeOrderFromCart.js";

function makeStore({catalogItems, cartItems, buyer}) {
    return configureStore({
        reducer: {
            catalog: catalogReducer,
            cart: cartReducer,
            order: orderReducer,
        },
        preloadedState: {
            catalog: {items: catalogItems, info: null, error: null},
            cart: {cartItems, info: null, error: null},
            order: {
                draftBuyer: buyer,
                lastOrder: null,
                excluded: [],
                warning: null,
                error: null,
            },
        },
    });
}

describe("placeOrderFromCart integration (real store + reducers + thunk)", () => {
    it("creates order only from valid items (soft mode) and clears cart (clearAll)", () => {
        const store = makeStore({
            catalogItems: [
                {isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false},
                {isbn: "B", title: "Beta", price: 7, flagOutOfStock: true},
            ],
            cartItems: [
                {isbn: "A", quantity: 2},
                {isbn: "B", quantity: 1},
            ],
            buyer: {name: "John", contact: "john@example.com"},
        });

        store.dispatch(placeOrderFromCart());

        const state = store.getState();

        // cart cleared (clearAll)
        expect(state.cart.cartItems).toEqual([]);

        // order created only from valid item A
        expect(state.order.lastOrder).not.toBe(null);
        expect(state.order.lastOrder.items).toHaveLength(1);
        expect(state.order.lastOrder.items[0].isbn).toBe("A");

        // excluded present (soft mode)
        expect(state.order.excluded).toHaveLength(1);
        expect(state.order.excluded[0].reason).toBe("OUT_OF_STOCK");
        expect(state.order.warning).toBeTruthy();
        expect(state.order.error).toBe(null);
    });

    it("does not create order and does not clear cart when there are no valid items", () => {
        const store = makeStore({
            catalogItems: [
                {isbn: "B", title: "Beta", price: 7, flagOutOfStock: true},
            ],
            cartItems: [
                {isbn: "B", quantity: 1},
            ],
            buyer: {name: "John", contact: "john@example.com"},
        });

        store.dispatch(placeOrderFromCart());

        const state = store.getState();

        // cart isn't cleared because order failed
        expect(state.cart.cartItems).toEqual([{isbn: "B", quantity: 1}]);

        // order isn't created
        expect(state.order.lastOrder).toBe(null);
        expect(state.order.error).toBeTruthy();
    });

    it("does not create order and does not clear cart when buyer is invalid", () => {
        const store = makeStore({
            catalogItems: [
                {isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false},
            ],
            cartItems: [
                {isbn: "A", quantity: 1},
            ],
            buyer: {name: "", contact: ""},
        });

        store.dispatch(placeOrderFromCart());

        const state = store.getState();

        // cart isn't cleared because order failed
        expect(state.cart.cartItems).toEqual([{isbn: "A", quantity: 1}]);

        // order isn't created
        expect(state.order.lastOrder).toBe(null);
        expect(state.order.error).toContain("Buyer name is required.");
        expect(state.order.error).toContain("Buyer contact is required.");
    });
});
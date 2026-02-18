import {createListenerMiddleware} from "@reduxjs/toolkit";

import {removeCartFromStorage, saveCartToStorage} from "./cartStorage.js";

/**
 * RTK Listener Middleware (modern RTK approach)
 *
 * Persists cart state to localStorage on cart-related actions.
 *
 * Behavior:
 * - React only to actions whose type starts with "cart/".
 * - Avoid redundant writes by comparing JSON snapshots.
 * - If cart becomes empty -> remove key instead of saving [].
 */
const cartPersistenceListener = createListenerMiddleware();


// Keep the last known snapshot to prevent redundant writes.
// We start with an empty cart snapshot; initial hydration may write once (acceptable).
let lastSnapshot = JSON.stringify([]);

cartPersistenceListener.startListening({
    predicate: (action) =>
        Boolean(action?.type) &&
        typeof action.type === "string" &&
        action.type.startsWith("cart/"),
    effect: async (_action, listenerApi) => {
        const cartItems = listenerApi.getState().cart.cartItems;
        const snapshot = JSON.stringify(cartItems);

        // 1) no changes -> no writes
        if (snapshot === lastSnapshot) return;
        lastSnapshot = snapshot;

        // 2) empty cart -> remove key
        if (Array.isArray(cartItems) && cartItems.length === 0) {
            removeCartFromStorage();
            return;
        }

        // 3) otherwise persist
        saveCartToStorage(cartItems);
    },
});

export const cartPersistenceListenerMiddleware = cartPersistenceListener.middleware;

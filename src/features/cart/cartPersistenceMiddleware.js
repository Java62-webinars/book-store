import {removeCartFromStorage, saveCartToStorage} from "./cartStorage.js";

/**
 * Middleware that persists cart state changes into localStorage.
 *
 * Key ideas:
 * - React only to cart-related actions (type starts with "cart/").
 * - Do nothing if cart snapshot hasn't changed (prevents redundant writes).
 * - If cart becomes empty, remove the key from storage instead of saving [].
 */
export function cartPersistenceMiddleware(storeApi) {
    // Start from the current state snapshot to avoid writing immediately on init.
    let lastSnapshot = JSON.stringify(storeApi.getState().cart.cartItems);

    return (next) => (action) => {
        const result = next(action);

        // Persist only when cart slice actions are dispatched.
        if (!action?.type || typeof action.type !== "string") return result;
        if (!action.type.startsWith("cart/")) return result;

        const cartItems = storeApi.getState().cart.cartItems;
        const snapshot = JSON.stringify(cartItems);

        // 1) no changes -> no writes
        if (snapshot === lastSnapshot) return result;
        lastSnapshot = snapshot;

        // 2) empty cart -> remove key
        if (Array.isArray(cartItems) && cartItems.length === 0) {
            removeCartFromStorage();
            return result;
        }

        // 3) otherwise persist
        saveCartToStorage(cartItems);

        return result;
    };
}

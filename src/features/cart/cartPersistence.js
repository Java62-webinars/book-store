import {removeCartFromStorage, saveCartToStorage} from "./cartStorage.js";

/**
 * Подключаем автосохранение cartItems в localStorage через store.subscribe().
 *
 * Важно:
 * - subscribe срабатывает после ЛЮБОГО dispatch (catalog тоже).
 * - Поэтому сохраняем ТОЛЬКО если cartItems реально изменились (snapshot).
 *
 * @param {import("@reduxjs/toolkit").EnhancedStore} store

 */
export function attachCartPersistence(store) {
    let lastSnapshot = JSON.stringify(store.getState().cart.cartItems);

    return store.subscribe(() => {
        const cartItems = store.getState().cart.cartItems;
        const snapshot = JSON.stringify(cartItems);

        if (snapshot === lastSnapshot) return;
        lastSnapshot = snapshot;

        if (Array.isArray(cartItems) && cartItems.length === 0) {
            removeCartFromStorage();
            return;
        }

        saveCartToStorage(cartItems);
    });
}

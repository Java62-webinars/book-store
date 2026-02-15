import {readJson, remove, writeJson} from "../../storage/storageClient.js";
import {STORAGE_KEYS} from "../../constants/storageKeys.js";

export function loadCartFromStorage() {
    return readJson(STORAGE_KEYS.CART);
}

export function saveCartToStorage(cartItems) {
    writeJson(STORAGE_KEYS.CART, cartItems);
}

export function removeCartFromStorage() {
    remove(STORAGE_KEYS.CART);
}

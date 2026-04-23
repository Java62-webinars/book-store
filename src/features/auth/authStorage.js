import {STORAGE_KEYS} from "../../constants/storageKeys.js";

export function loadAuthFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.AUTH);

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function saveAuthToStorage(authData) {
    try {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    } catch {
        // ignore storage errors in demo mode
    }
}

export function clearAuthStorage() {
    try {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
        // ignore storage errors in demo mode
    }
}
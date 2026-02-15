import {loadCartFromStorage} from "./cartStorage.js";
import {setCartItems} from "./cartSlice.js";
import {createCartItem} from "../../entities/cart/cartItem.js";
import {isValidCartItem} from "../../entities/cart/isValidCartItem.js";

/**
 * Гидратация корзины из localStorage.
 *
 * Почему thunk:
 * - cart сам отвечает за свои данные
 * - store остаётся "чистым"
 *
 * Что делаем:
 * 1) читаем raw массив
 * 2) нормализуем каждый элемент через createCartItem
 * 3) валидируем через isValidCartItem
 * 4) кладём в state через setCartItems
 */
export function loadCart() {
    return (dispatch) => {
        const raw = loadCartFromStorage();

        if (!Array.isArray(raw)) {
            dispatch(setCartItems([]));
            return;
        }

        const hydrated = [];
        for (const item of raw) {
            const normalized = createCartItem({
                isbn: item?.isbn,
                quantity: item?.quantity,
            });

            if (isValidCartItem(normalized)) hydrated.push(normalized);
        }

        dispatch(setCartItems(hydrated));
    };
}

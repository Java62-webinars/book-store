import {buildOrderDraftFromCart} from "./buildOrderDraftFromCart.js";
import {createOrder} from "../../entities/order/order.js";
import {clearOrderMessages, setOrderError, setOrderSuccess} from "./orderSlice.js";
import {setCartItems} from "../cart/cartSlice.js";

/**
 * placeOrderFromCart()
 *
 * Thunk (feature-level orchestration) for SOFT mode.

 * Responsibilities:
 * 1) Read current state (cart + catalog + draftBuyer).
 * 2) Build order items ONLY from valid cart positions (book exists + not outOfStock).
 * 3) Create the Order entity (validate buyer/items, compute totals, etc.).
 * 4) On success:
 *    - store lastOrder
 *    - store excluded positions for warning (soft mode)
 *    - clear the cart (clearAll policy)
 * 5) On failure:
 *    - store error
 *    - DO NOT change the cart
 *
 * @returns {(dispatch: Function, getState: Function) => void}
 */
export function placeOrderFromCart() {
    return (dispatch, getState) => {
        dispatch(clearOrderMessages());

        const state = getState();

        const cartItems = state.cart?.cartItems ?? [];
        const catalogItems = state.catalog?.items ?? [];
        const buyer = state.order?.draftBuyer ?? {name: "", contact: ""};

        // Build draft items from (cart + catalog). Soft mode keeps excluded.
        const draft = buildOrderDraftFromCart(cartItems, catalogItems);

        // Create & validate order entity (buyer + items).
        const result = createOrder({buyer, items: draft.items});

        if (!result.ok) {
            dispatch(setOrderError(result.errors.join(" ")));
            return;
        }

        // Success: store order + excluded (soft mode warning)
        dispatch(setOrderSuccess({order: result.order, excluded: draft.excluded}));

        // clearAll policy: cart becomes empty after successful order
        dispatch(setCartItems([]));
    };
}
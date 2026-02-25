import {createSlice} from "@reduxjs/toolkit";

/**
 * orderSlice
 *
 * Feature-level state for placing an order (soft mode).
 * This slice DOES NOT build order items from cart/catalog — that is done in the use-case
 * buildOrderDraftFromCart(...) and later in a thunk (placeOrderFromCart).
 *
 * Here we only store:
 * - draftBuyer: buyer form data
 * - lastOrder: result of successful order placement
 * - excluded: excluded cart positions (invalid) for soft-mode warning display
 * - warning/error: messages for UI
 */
const initialState = {
    draftBuyer: {
        name: "",
        contact: "",
    },
    lastOrder: null,
    excluded: [],
    warning: null,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        /**
         * setBuyerField({ field, value })
         * Updates one buyer field (name/contact).
         */
        setBuyerField: (state, action) => {
            const field = action?.payload?.field;
            const value = action?.payload?.value;

            state.warning = null;
            state.error = null;

            if (field !== "name" && field !== "contact") {
                state.error = "Invalid buyer field";
                return;
            }

            state.draftBuyer[field] = String(value ?? "");
        },

        /**
         * setBuyer({ name, contact })
         * Replaces buyer draft with provided data.
         */
        setBuyer: (state, action) => {
            const name = action?.payload?.name;
            const contact = action?.payload?.contact;

            state.warning = null;
            state.error = null;

            state.draftBuyer = {
                name: String(name ?? ""),
                contact: String(contact ?? ""),
            };
        },

        /**
         * resetBuyer()
         * Clears buyer draft fields.
         */
        resetBuyer: (state) => {
            state.draftBuyer = {name: "", contact: ""};
        },

        /**
         * clearOrderMessages()
         * Clears warning/error messages.
         */
        clearOrderMessages: (state) => {
            state.warning = null;
            state.error = null;
        },

        /**
         * clearLastOrder()
         * Clears last order and any excluded items.
         */
        clearLastOrder: (state) => {
            state.lastOrder = null;
            state.excluded = [];
        },

        /**
         * setOrderSuccess({ order, excluded })
         * Stores the latest order and soft-mode excluded positions.
         * (Actual order building/validation is done elsewhere.)
         */
        setOrderSuccess: (state, action) => {
            const order = action?.payload?.order ?? null;
            const excluded = Array.isArray(action?.payload?.excluded) ? action.payload.excluded : [];

            state.lastOrder = order;
            state.excluded = excluded;

            state.error = null;
            state.warning =
                excluded.length > 0
                    ? `Excluded ${excluded.length} item(s) from the order because they are unavailable.`
                    : null;
        },

        /**
         * setOrderError(message)
         * Stores an error message when placing an order failed.
         */
        setOrderError: (state, action) => {
            state.warning = null;
            state.error = String(action?.payload ?? "Unknown order error");
        },
    },
});

export const {
    setBuyerField,
    setBuyer,
    resetBuyer,
    clearOrderMessages,
    clearLastOrder,
    setOrderSuccess,
    setOrderError,
} = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
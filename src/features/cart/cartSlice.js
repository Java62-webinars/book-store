import {createSlice} from "@reduxjs/toolkit";
import {createCartItem} from "../../entities/cart/cartItem.js";
import {isValidCartItem} from "../../entities/cart/isValidCartItem.js";

const initialState = {
    cartItems: [],
    info: null,
    error: null,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const isbn = action.payload;
            // state.info = null;
            // state.error = null;
            if (!isbn) {
                state.error = 'ISBN is required';
                state.info = null
                return;
            }
            const existingItem = state.cartItems.find((item) => item.isbn === isbn);
            if (existingItem) {
                state.info = "Quantity increased";
                state.error = null;
                existingItem.quantity += 1;
                return;
            }

            const newItem = createCartItem({isbn});
            if (!isValidCartItem(newItem)) {
                state.error = "Invalid cart item";
                state.info = null
                return;
            }

            state.cartItems.push(newItem);
            state.info = "Item added to cart";
            state.error = null;

        },
        removeItem: (state, action) => {
            const isbn = action.payload;
            state.info = null;
            state.error = null;
            if (!isbn) {
                state.error = "ISBN is required";
                return;
            }

            const oldLength = state.cartItems.length;
            state.cartItems = state.cartItems.filter((item) => item.isbn !== isbn);
            if (oldLength === state.cartItems.length) {
                state.error = "Item not found in cart";
                return;
            }
            state.info = "Item removed from cart";
        },
        changeQuantity: (state, action) => {
            const {isbn, newQuantity} = action.payload;
            state.info = null;
            state.error = null;
            if (!isbn) {
                state.error = "ISBN is required";
                return;
            }

            if (typeof newQuantity !== "number" || !Number.isInteger(newQuantity) || newQuantity < 0) {
                state.error = "Invalid quantity";
                return;
            }

            const victim = state.cartItems.find(item => item.isbn === isbn);
            if (!victim) {
                state.error = "ISBN not found in cart";
                return;
            }

            if (newQuantity === 0) {
                state.cartItems = state.cartItems.filter((item) => item.isbn !== isbn);
                state.info = "Item removed from cart because new quantity = 0";
                return;
            }

            victim.quantity = newQuantity;
            state.info = "quantity updated";
        },
        clearCartMessages(state) {
            state.info = null;
            state.error = null;
        },
        setCartError(state, action) {
            state.info = null;
            state.error = action.payload ?? "Unknown cart error";
        },
    },
});
export const {addItem, removeItem, changeQuantity, setCartError, clearCartMessages} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
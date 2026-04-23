import {configureStore} from "@reduxjs/toolkit";
import {catalogReducer} from "../features/catalog/catalogSlice.js";
import {cartReducer} from "../features/cart/cartSlice.js";
import {cartPersistenceListenerMiddleware} from "../features/cart/cartPersistenceListenerMiddleware.js";
import {orderReducer} from "../features/order/orderSlice.js";
import {authReducer} from "../features/auth/authSlice.js";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        catalog: catalogReducer,
        cart: cartReducer,
        order: orderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartPersistenceListenerMiddleware),
})
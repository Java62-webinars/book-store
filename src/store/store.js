import {configureStore} from "@reduxjs/toolkit";
import {catalogReducer} from "../features/catalog/catalogSlice.js";
import {cartReducer} from "../features/cart/cartSlice.js";
import {cartPersistenceListenerMiddleware} from "../features/cart/cartPersistenceListenerMiddleware.js";

export const store = configureStore({
    reducer:{
        catalog: catalogReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartPersistenceListenerMiddleware),
})
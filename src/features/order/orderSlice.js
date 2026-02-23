import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    draftBuyer: {
        name: "Test",
        contact: "test@test.com"
    },
    lastOrder: null,
    excluded: [],
    warning: null,
    error: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setBuyer: (state, action) => {
        },
        setBuyerField: (state, action) => {
        },
        resetBuyer: (state, action) => {
        },
        setOrderSuccess: (state, action) => {
        },
        setOrderError: (state, action) => {
        },

    }
})
export const {setBuyer, setBuyerField, resetBuyer, setOrderError, setOrderSuccess} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
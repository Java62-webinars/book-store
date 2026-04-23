import {createSlice} from "@reduxjs/toolkit";
import {loadAuthFromStorage} from "./authStorage.js";

const demoUser = {
    id: "demo-user",
    name: "Demo User",
    role: "user",
};

const storedUser = loadAuthFromStorage();

const initialState = {
    currentUser: storedUser || demoUser,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        logout(state) {
            state.currentUser = null;
        },
    },
});

export const {setCurrentUser, logout} = authSlice.actions;
export const authReducer = authSlice.reducer;
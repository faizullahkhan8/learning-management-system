/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        userRegisteration: (state, action) => {
            state.token = action.payload.token;
        },
        userLoggedIn: (
            state,
            action: PayloadAction<{ token: string; user: string }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        userLoggedOut: (state, action) => {
            state.token = "";
            state.user = "";
        },
    },
});

export const { userRegisteration, userLoggedIn, userLoggedOut } =
    authSlice.actions;

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: "user",
    initialState: {
        value: {
            email: "Praveen Anusha",
            password: "143"
        }
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
        },
        logout: (state) => {
            state.value = { email: "", password: "" };
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

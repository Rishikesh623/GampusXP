import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        email: '',
        password: ''
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.password = action.payload.password;
        },
        updateUsername: (state, action) => {
            state.username = action.payload.username;
        },
        updateEmail: (state, action) => {
            state.email = action.payload.email;
        },
        updatePassword: (state, action) => {
            state.password = action.payload.password;
        }
    }
})

export const { setUserProfile, updateEmail, updatePassword, updateUsername } = userSlice.actions;
export default userSlice.reducer;
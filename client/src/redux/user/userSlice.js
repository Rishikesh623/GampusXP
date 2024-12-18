import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        reg_no: null,
        email: '',
        password: '',
        token: null
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.name = action.payload.name;
            state.reg_no = action.payload.reg_no;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.token = action.payload.token;
        },
        updateRegNo: (state, action) => {
            state.reg_no = action.payload.reg_no;
        },
        updateEmail: (state, action) => {
            state.email = action.payload.email;
        },
        updatePassword: (state, action) => {
            state.password = action.payload.password;
        },
        updateToken: (state, action) => {
            state.token = action.payload.token;
        }
    }
})

export const { setUserProfile, updateEmail, updatePassword, updateRegNo, updateToken } = userSlice.actions;
export default userSlice.reducer;
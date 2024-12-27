import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        reg_no: '',
        email: '',
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.name = action.payload.name;
            state.reg_no = action.payload.reg_no;
            state.email = action.payload.email;
            state.password = action.payload.password;
        },
        updateRegNo: (state, action) => {
            state.reg_no = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        logout: (state) => {
            return { name: null, email: null, reg_no: null };
        },
    }
})

export const { setUserProfile, updateEmail, updateRegNo, logout } = userSlice.actions;
export default userSlice.reducer;
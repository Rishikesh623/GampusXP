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
        }
    }
})

export const { setUserProfile, updateEmail, updateRegNo } = userSlice.actions;
export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        reg_no: '',
        email: '',
        aura_points: 0
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.name = action.payload.name;
            state.reg_no = action.payload.reg_no;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.aura_points = action.payload.aura_points;
        },
        updateRegNo: (state, action) => {
            state.reg_no = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updateAuraPoints: (state, action) => {
            state.aura_points = action.payload;
        },
        logout: (state) => {
            return { name: null, email: null, reg_no: null, aura_points: 0 };
        },
    }
})

export const { setUserProfile, updateEmail, updateRegNo, updateAuraPoints, logout } = userSlice.actions;
export default userSlice.reducer;
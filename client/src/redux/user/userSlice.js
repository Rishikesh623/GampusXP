import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    reg_no: '',
    email: '',
    about: '',
    aura_points: 0,
    showRecentActivity: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.name = action.payload.name;
            state.reg_no = action.payload.reg_no;
            state.email = action.payload.email;
            state.about = action.payload.about;
            state.aura_points = action.payload.aura_points;
            state.showRecentActivity = action.payload.showRecentActivity;
        },
        updateRegNo: (state, action) => {
            state.reg_no = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updateAbout: (state, action) => {
            state.about = action.payload;
        },
        updateAuraPoints: (state, action) => {
            state.aura_points = action.payload;
        },
        updateShowRecentActivityFlag: (state, action) => {
            state.showRecentActivity = action.payload;
        },
        logout: () => initialState,
    }
});

export const {
    setUserProfile,
    updateEmail,
    updateRegNo,
    updateAbout,
    updateAuraPoints,
    updateShowRecentActivityFlag,
    logout
} = userSlice.actions;
export default userSlice.reducer;

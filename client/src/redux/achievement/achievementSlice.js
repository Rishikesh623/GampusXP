import { createSlice } from "@reduxjs/toolkit";

const achievementSlice = createSlice({
    name: 'achievement',
    initialState: {
        achievement: []
    },
    reducers: {
        setAchievement: (state, action) => {
            state.achievement = action.payload
        },
        clearAchievement: (state, action) => {
            state.achievement = []
        }
    }
})

export const { setAchievement, clearAchievement } = achievementSlice.actions;
export default achievementSlice.reducer;
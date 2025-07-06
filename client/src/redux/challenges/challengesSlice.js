import { createSlice } from "@reduxjs/toolkit";

const challengesSlice = createSlice({
    name: 'challenges',
    initialState: {
        challenges: [],
    },
    reducers: {
        setChallenges: (state, action) => {
            state.challenges = action.payload
        },
        clearChallenges: (state, action) => {
            state.challenges = []
        }
    }
})

export const { setChallenges, clearChallenges } = challengesSlice.actions;
export default challengesSlice.reducer;
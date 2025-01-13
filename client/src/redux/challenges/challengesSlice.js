import { createSlice } from "@reduxjs/toolkit";

const challengesSlice = createSlice({
    name: 'challengeS',
    initialState: {
        challengeS: [],
    },
    reducers: {
        setChallengeS: (state, action) => {
            state.challengeS = action.payload
        },
        clearChallegneS: (state, action) => {
            state.challengeS = []
        }
    }
})

export const { setChallengeS, clearChallegneS } = challengesSlice.actions;
export default challengesSlice.reducer;
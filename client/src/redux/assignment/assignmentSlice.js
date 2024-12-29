import { createSlice } from "@reduxjs/toolkit";

const assignmentSlice = createSlice({
    name: 'cassignment',
    initialState: {
        cassignment: []
    },
    reducers: {
        setCAssignment: (state, action) => {
            state.cassignment = action.payload
        },
        clearAssignment: (state, action) => {
            state.cassignment = []
        }
    }
})

export const { setCAssignment, clearAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;
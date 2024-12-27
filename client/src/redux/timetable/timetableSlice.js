import { createSlice } from "@reduxjs/toolkit";

const timetableSlice = createSlice({
    name: 'ctimetable',
    initialState: {
        ctimetable: null, // Holds the timetable data
    },
    reducers: {
        setTimeTable: (state, action) => {
            state.ctimetable = action.payload; // Set the ctimetable directly from the payload
        },
    },
});

export const { setTimeTable } = timetableSlice.actions;
export default timetableSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: 'default',
    reducers: {
        setTheme: (state, action) => action.payload
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
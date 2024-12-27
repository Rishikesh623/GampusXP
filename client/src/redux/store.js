import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage as the default storage engine
import themeReducer from './theme/themeSlice';
import userReducer from './user/userSlice';
import timetableReducer from './timetable/timetableSlice'; // Assume this is the reducer for ctimetable

// Persist configuration for user slice
const userPersistConfig = {
    key: 'user',
    storage,
};

// Persist configuration for ctimetable slice (optional)
const ctimetablePersistConfig = {
    key: 'ctimetable',
    storage,
};

// Wrapping reducers with persistence
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCtimetableReducer = persistReducer(ctimetablePersistConfig, timetableReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        theme: themeReducer,
        ctimetable: persistedCtimetableReducer, // Updated key to ctimetable
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE', 'persist/FLUSH', 'persist/PAUSE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage as the default storage engine
import themeReducer from './theme/themeSlice';
import userReducer from './user/userSlice';

const userPersistConfig = {
    key: 'user',
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: persistedUserReducer,
    },
});

export const persistor = persistStore(store);
export default store;

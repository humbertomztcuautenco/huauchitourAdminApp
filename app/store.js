import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import testSlice from "./features/test/testSlice";
import authSlice from "./features/auth/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    test: testSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        test: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register', 'rehydrate'],
            },
        }),
})
const persistor = persistStore(store);

/*********************+< Para purgar la app > *********************/
// persistor.purge().then(() => {
//   console.log('Persisted state has been purged.');
// });
/*********************</ Para purgar la app > *********************/

export { persistor };
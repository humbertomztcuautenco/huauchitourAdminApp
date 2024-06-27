import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import testSlice from "./features/test/testSlice";
import authSlice from "./features/auth/authSlice";
import selectEstabSlice from "./features/selectEstab/selectEstabSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    test: testSlice, /* SE CAMBIARA POR COLORS */
    selectEstab:selectEstabSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register', 'rehydrate'],
            },
        }),
})

const persistor = persistStore(store);
export { persistor };

const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log('AsyncStorage has been cleared.');
    } catch (e) {
        console.error('Error clearing AsyncStorage:', e);
    }
};

// Llama a esta función donde necesites limpiar AsyncStorage, por ejemplo, al cerrar sesión


const purgePersistedStore = () => {
    persistor.purge()
        .then(() => {
            console.log('Persisted store has been purged.');
        })
        .catch((e) => {
            console.error('Error purging persisted store:', e);
        });
};

//purgePersistedStore(); 
//clearAsyncStorage(); 
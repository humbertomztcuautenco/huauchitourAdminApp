import { createSlice } from "@reduxjs/toolkit";
import storage from '@react-native-async-storage/async-storage';

const initialState = { 
    token: null,
    user: null,
    estabs: null,
    estabSelect: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        add: (state, action) => {
            const { token, user, estabs, estabSelect } = action.payload;
            state.token = token;
            state.user = user;
            state.estabs = estabs;
            state.estabSelect = estabSelect;
            // Almacenar en AsyncStorage
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('user', user);
            AsyncStorage.setItem('estabs', JSON.stringify(estabs));
            AsyncStorage.setItem('estabSelect', estabSelect);
        },
        remove: (state) => {
            state.token = null;
            state.user = null;
            state.estabs = null;
            state.estabSelect = null;
            // Limpiar AsyncStorage
            AsyncStorage.clear();
        },
        update: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
            // Actualizar AsyncStorage
            AsyncStorage.setItem(key, value);
        },
    },
});

export const { add, remove, update } = authSlice.actions;
export default authSlice.reducer;
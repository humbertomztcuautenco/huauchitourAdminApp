import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estado inicial
const initialState = {
    token: null,
    user: null,
    estabs: null,
    estabSelect: null,
    isLogin: true,
    loading: true,  // Estado de carga inicial
};

// Thunks
export const retrieveToken = createAsyncThunk(
    'auth/retrieveToken',
    async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
            throw error;
        }
    }
);

export const addUser = createAsyncThunk(
    'auth/addUser',
    async ({ token, user, estabs, estabSelect, id }) => {
        try {
            await AsyncStorage.multiSet([
                ['token', token],
                ['user', user],
                ['estabs', JSON.stringify(estabs)],
/*                 ['estabSelect', estabSelect],
 */            ]);
            return { token, user, estabs, estabSelect, id };
        } catch (error) {
            console.error('Error storing user data in AsyncStorage:', error);
            throw error;
        }
    }
);

export const removeUser = createAsyncThunk(
    'auth/removeUser',
    async () => {
        try {
            await AsyncStorage.clear();
            return null;
        } catch (error) {
            console.error('Error removing user data from AsyncStorage:', error);
            throw error;
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        update: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        add: (state, action) => {
            const { token, user, estabs } = action.payload;
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('user', user);
            AsyncStorage.setItem('estabs', JSON.stringify(estabs));
            /*             AsyncStorage.setItem('estabSelect', null); */
            return action.payload;
        },
        selectEstab: (state, action) => {
            const { estabSelect } = action.payload;
            state.estabSelect = estabSelect;
            AsyncStorage.setItem('estabSelect', estabSelect);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(retrieveToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveToken.fulfilled, (state, action) => {
                state.token = action.payload;
                state.isLogin = !action.payload;
                state.loading = false;
            })
            .addCase(retrieveToken.rejected, (state) => {
                state.loading = false;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                const { token, user, estabs, estabSelect } = action.payload;
                state.token = token;
                state.user = user;
                state.estabs = estabs;
                state.estabSelect = estabSelect;
                state.isLogin = false;
            })
            .addCase(removeUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.estabs = null;
                state.estabSelect = null;
                state.isLogin = true;
            });
    }
});

export const { update, add, selectEstab } = authSlice.actions;
export default authSlice.reducer;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedEstab: null,
};

// Función auxiliar para obtener el establecimiento seleccionado desde AsyncStorage
export const getSelectedEstabFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('selectedEstab');

        if (!jsonValue) {

            return null;
        } 
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        return null;
    }
};

export const selectEstablishment = createAsyncThunk(
    'selectEstab/select',
    async ({ selectedEstab }, { rejectWithValue }) => {
        try {
            if (!selectedEstab) {
                throw new Error('selectedEstab is undefined or null');
            }
            await AsyncStorage.setItem('selectedEstab', JSON.stringify(selectedEstab));

            return selectedEstab;
        } catch (error) {
            console.error('Error storing user data in AsyncStorage:', error);
            return rejectWithValue(error.message);
        }
    }
);

const selectEstabSlice = createSlice({
    name: 'selectEstab',
    initialState,
    reducers: {
        selectEstab: (state, action) => {
            const selectedEstab = action.payload;
            if (!selectedEstab) {
                console.error('Selected establishment is undefined or null');
                return;
            }

            state.selectedEstab = selectedEstab;
            AsyncStorage.setItem('selectedEstab', JSON.stringify(selectedEstab)).catch(error => {
                console.error('Error storing user data in AsyncStorage:', error);
            });
        },
        clearEstab: (state) => {
            state.selectedEstab = null;
            AsyncStorage.removeItem('selectedEstab').catch(error => {
                console.error('Error removing user data from AsyncStorage:', error);
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(selectEstablishment.fulfilled, (state, action) => {
                state.selectedEstab = action.payload;
            })
            .addCase(selectEstablishment.rejected, (state, action) => {
                console.error('Error in selectEstablishment:', action.payload);
            });
    }
});

// Selector para obtener el establecimiento seleccionado
export const getSelectedEstab = (state) => state.selectEstab.selectedEstab;

// Acciones exportadas
export const { selectEstab, clearEstab } = selectEstabSlice.actions;
export default selectEstabSlice.reducer;

// Función para cargar el establecimiento seleccionado desde AsyncStorage
export const loadSelectedEstabFromStorage = () => async (dispatch) => {
    const selectedEstab = await getSelectedEstabFromStorage();
    if (selectedEstab) {
        dispatch(selectEstab(selectedEstab));
    }
};

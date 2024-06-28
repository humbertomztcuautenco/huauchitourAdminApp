import { createSlice } from "@reduxjs/toolkit";

export const testSlice = createSlice({
    name: 'test',
    initialState: "Mensaje de prueba",
    reducers:{
        viewMessage : (state, payload) => {
        }
    }
})

export const { viewMessage } = testSlice.actions;
export default testSlice.reducer;
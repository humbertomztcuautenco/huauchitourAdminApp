import { createSlice } from "@reduxjs/toolkit";

export const testSlice = createSlice({
    name: 'test',
    initialState: "Mensaje de prueba",
    reducers:{
        viewMessage : (state, payload) => {
            console.log(state);
        }
    }
})

export const { viewMessage } = testSlice.actions;
export default testSlice.reducer;
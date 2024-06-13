import { configureStore } from "@reduxjs/toolkit";
import testSlice from "./features/test/testSlice";

export const store = configureStore({
    reducer: {
        test: testSlice 
    }
})
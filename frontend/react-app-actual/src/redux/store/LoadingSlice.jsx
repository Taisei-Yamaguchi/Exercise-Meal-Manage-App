// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};

const LoadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action) => {
        state.loading = action.payload;
        }
    },
});


export const { setLoading } = LoadingSlice.actions;

export default LoadingSlice.reducer;

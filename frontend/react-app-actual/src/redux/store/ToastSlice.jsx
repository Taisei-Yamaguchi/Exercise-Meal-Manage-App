// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toastMes: '',
    toastClass: '',
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToastMes: (state, action) => {
        state.toastMes = action.payload;
        },
        setToastClass: (state,action)=> {
            state.toastClass =action.payload;
        }
    },
});


export const { setToastMes, setToastClass } = toastSlice.actions;

export default toastSlice.reducer;

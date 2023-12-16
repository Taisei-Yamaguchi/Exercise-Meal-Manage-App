// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mainLoading: false,
    modalLoading: false,
    updateContentLoading: false,
    updateContentId: '',
};

const LoadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setMainLoading: (state, action) => {
        state.mainLoading = action.payload;
        },

        setModalLoading: (state, action) =>{
            state.modalLoading = action.payload;
        },

        setUpdateContentLoading: (state,action) =>{
            state.updateContentLoading =action.payload;
        },

        setUpdateContentId: (state,action) =>{
            state.updateContentId =action.payload;
        },
    },
});


export const { 
    setMainLoading, 
    setModalLoading, 
    setUpdateContentLoading,
    setUpdateContentId,
} = LoadingSlice.actions;

export default LoadingSlice.reducer;

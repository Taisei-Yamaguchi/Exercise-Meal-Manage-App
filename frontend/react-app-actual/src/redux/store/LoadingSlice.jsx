// src/store/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mainLoading: false,
    modalLoading: false,
    updateContentLoading: false,
    updateContentId: '',

    mealLoading: false,
    foodLoading: false,

    exerciseLoading: false,
    workoutLoading: false,
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

        setMealLoading: (state,action) =>{
            state.mealLoading =action.payload;
        },

        setFoodLoading: (state,action) =>{
            state.foodLoading =action.payload;
        },

        setExerciseLoading: (state,action) =>{
            state.exerciseLoading =action.payload;
        },

        setWorkoutLoading: (state,action) =>{
            state.workoutLoading =action.payload;
        },
    },
});


export const { 
    setMainLoading, 
    setModalLoading, 
    setUpdateContentLoading,
    setUpdateContentId,
    setMealLoading,
    setFoodLoading,
    setExerciseLoading,
    setWorkoutLoading,
} = LoadingSlice.actions;

export default LoadingSlice.reducer;

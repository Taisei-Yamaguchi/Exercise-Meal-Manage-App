// // src/store.jsx
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './reducers/index.jsx'

// const store = createStore(rootReducer, applyMiddleware(thunk));


import { configureStore } from '@reduxjs/toolkit';
import ToastSlice from './store/ToastSlice';
import LoadingSlice from './store/LoadingSlice';

const store = configureStore({
    reducer: {
        toast: ToastSlice,
        loading: LoadingSlice,
    },
});

export default store;

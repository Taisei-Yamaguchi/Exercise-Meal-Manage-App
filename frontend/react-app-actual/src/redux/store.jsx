// src/store/index.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index.jsx'

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

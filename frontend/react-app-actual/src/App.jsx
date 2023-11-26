// src/App.jsx
import React from 'react';
import 'chart.js';
import { Provider } from 'react-redux';
import store from './redux/store'; // 作成したRedux Storeをインポート
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Home from './components/Home';
import Login from './components/account/Login';
import Dashboard from './components/Dashboard';
import NotFound from './components/404NotFound';
import SignUp from './components/account/SignUp';
import SignUpConfirm from './components/account/SignUpConfirm';
import PasswordResetRequest from './components/account/PasswordResetRequest';
import PasswordResetProcess from './components/account/PasswordResetProcess';
import MealsByDate from './components/meal/MealsByDate';
import FoodSearch from './components/meal/FoodSearch';
import FoodCreate from './components/meal/FoodCreate';
import NutrientsByDateGraph from './components/meal/NutriensByDateGraph';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/email-confirmation/:uid/:token" element={<SignUpConfirm />} />
          <Route path="/password-reset/request" element={<PasswordResetRequest />} />
          <Route path="/password-reset/process/:uid/:token" element={<PasswordResetProcess />}/>
          <Route path="/meal/:date" element={<MealsByDate />}/>
          <Route path="/meal/food-search/:meal_type/:date" element={<FoodSearch />}/>
          <Route path="/meal/food-create/:date" element={<FoodCreate/>}/>
          <Route path="/meal/nutrients-graph/:date" element={<NutrientsByDateGraph/>}/>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

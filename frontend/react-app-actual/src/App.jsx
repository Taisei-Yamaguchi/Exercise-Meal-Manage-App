// src/App.jsx
import React from 'react';
import 'chart.js';
import { Provider } from 'react-redux';
import store from './redux/store'; // 作成したRedux Storeをインポート
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Home from './components/Home';

import NotFound from './components/404NotFound';

import Login from './components/account/Login';
import SignUp from './components/account/SignUp';
import SignUpConfirm from './components/account/SignUpConfirm';
import PasswordResetRequest from './components/account/PasswordResetRequest';
import PasswordResetProcess from './components/account/PasswordResetProcess';

import Dashboard from './components/Dashboard';

import MealsByDate from './components/meal/MealsByDate';
import FoodSearch from './components/meal/FoodSearch';
import FoodCreate from './components/meal/FoodCreate';
import NutrientsByDateGraph from './components/meal/NutriensByDateGraph';

import ExerciseByDate from './components/exercise/ExerciseByDate';
import ExerciseTotalWeightGraph from './components/exercise/ExerciseTotalWeightGraph';
import DailyExerciseWeightGraph from './components/exercise/DailyExerciseWeightGraph';

import UserInfo from './components/user_info/UserInfo';
import WeightGraph from './components/user_info/WeightGraph';
import BodyFatPercentageGraph from './components/user_info/BodyFatPercentageGraph';
import MuscleMassGraph from './components/user_info/MuscleMassGraph';
import CalsGraph from './components/user_info/CalsGraph';

import SettingsAccount from './components/settings/SettingsAccount';

import MainCalendar from './components/calendar/MainCalendar';

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

          <Route path="/exercise/:date" element={<ExerciseByDate/>}/>
          <Route path="/exercise/exercise-total-weight-graph/:date" element={<ExerciseTotalWeightGraph/>}/>
          <Route path="/exercise/daily-exercise-weight-graph/:date/:workout_type" element={<DailyExerciseWeightGraph/>}/>

          <Route path="/user_info" element={<UserInfo />}/>
          <Route path="/user_info/weight-graph" element={<WeightGraph />}/>
          <Route path="/user_info/body-fat-percentage-graph" element={<BodyFatPercentageGraph />}/>
          <Route path="/user_info/muscle-mass-graph" element={<MuscleMassGraph />}/>
          <Route path="/user_info/cals-graph" element={<CalsGraph />}/>

          <Route path="/settings" element={<SettingsAccount/>}/>

          <Route path="/calendar/:month" element={<MainCalendar/>}/>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

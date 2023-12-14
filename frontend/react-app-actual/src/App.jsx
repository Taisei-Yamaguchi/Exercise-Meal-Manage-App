// src/App.jsx
import React from 'react';
import 'chart.js';
import { Provider } from 'react-redux';
import store from './redux/store'; // 作成したRedux Storeをインポート
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Home from './pages/Home';

import NotFound from './pages/404NotFound';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SignUpConfirm from './pages/auth/SignUpConfirm';
import PasswordResetRequest from './pages/auth/PasswordResetRequest';
import PasswordResetProcess from './pages/auth/PasswordResetProcess';

import Dashboard from './pages/Dashboard';

import MealsByDate from './pages/MealsByDate';
// import NutrientsByDateGraph from './components/meal/NutriensByDateGraph';

import ExerciseByDate from './pages/ExerciseByDate';
import ExerciseTotalWeightGraph from './pages/ExerciseTotalWeightGraph';
import DailyExerciseWeightGraph from './pages/DailyExerciseWeightGraph';

import UserInfo from './pages/UserInfo';
import WeightGraph from './pages/WeightGraph';
import BodyFatPercentageGraph from './pages/BodyFatPercentageGraph';
import MuscleMassGraph from './pages/MuscleMassGraph';
import CalsGraph from './pages/CalsGraph';

import SettingsAccount from './pages/SettingsAccount';

import Goal from './pages/Goal';

import { FetchFoodProvider } from './hooks/fetchFoodContext';
import { FetchWorkoutProvider } from './hooks/fetchWorkoutContext';


const App = () => {
  return (
    <Provider store={store}>
      <FetchFoodProvider>
      <FetchWorkoutProvider>
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
          {/* <Route path="/meal/nutrients-graph/:date" element={<NutrientsByDateGraph/>}/> */}

          <Route path="/exercise/:date" element={<ExerciseByDate/>}/>
          <Route path="/exercise/exercise-total-weight-graph/:date" element={<ExerciseTotalWeightGraph/>}/>
          <Route path="/exercise/daily-exercise-weight-graph/:date/:workout_type" element={<DailyExerciseWeightGraph/>}/>

          <Route path="/user_info" element={<UserInfo />}/>
          <Route path="/user_info/weight-graph" element={<WeightGraph />}/>
          <Route path="/user_info/body-fat-percentage-graph" element={<BodyFatPercentageGraph />}/>
          <Route path="/user_info/muscle-mass-graph" element={<MuscleMassGraph />}/>
          <Route path="/user_info/cals-graph" element={<CalsGraph />}/>

          <Route path="/settings" element={<SettingsAccount/>}/>

          <Route path="/goal" element={<Goal />}/>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
      </FetchWorkoutProvider>
      </FetchFoodProvider>
    </Provider>
  );
};

export default App;

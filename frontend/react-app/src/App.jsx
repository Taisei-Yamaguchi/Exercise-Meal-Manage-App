import { useState, useEffect } from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

import './App.css';

import SignUp from './components/accounts/SignUp';
import Login from './components/accounts/Login';
import AccountUpdate from './components/accounts/AccountUpdate';
import AccountGet from './components/accounts/AccountGet';

import ConfirmationPage from './components/accounts/ConfirmationPage';
import PasswordResetRequestPage from './components/accounts/PasswordResetRequestPage';
import PasswordResetPage from './components/accounts/PasswordReset';

import FoodForm from './components/meal/FoodPost';
import FoodList from './components/meal/FoodList';

import MealDate from './components/meal/MealDate';

import UserInfoForm from './components/user_info/UserInfoFrom';

import WorkoutForm from './components/exercise/WorkoutForm';
import WorkoutList from './components/exercise/WorkoutList';
import ExerciseCreate from './components/exercise/ExerciseCreate';
import ExerciseDate from './components/exercise/ExerciseDate';

import WeightGraph from './components/graph/WeightGraph';
import BodyFatPercentageGraph from './components/graph/BodyFatPercentageGraph';
import MuscleMassGraph from './components/graph/MuscleMassGraph';
import ExerciseTotalWeightGraph from './components/graph/ExerciseTotalWeightGraph';
import DailyNutrientsGraph from './components/graph/DailyNutrientsGraph';
import DailyExerciseWeightGraph from './components/graph/DailyExerciseWeightGraph';
import CalsGraph from './components/graph/CalsGraph';

import FoodSearch from './components/meal/FoodSearch';
import SearchedFoodHistory from './components/meal/SearchedFoodHistory';
import RegistrationStatusCheck from './components/main/RegistrationStatusCheck';
import CalsByDate from './components/main/CalsByDate';
import PFCByDate from './components/main/PFCByDate';

function App() {
  

  return (
    <div>

    <BrowserRouter>
      <Routes>
        
        <Route path='/accounts/signup' element={<SignUp />}/>
        <Route path='/accounts/login' element={<Login />}/>
        <Route path='/accounts/update' element={<AccountUpdate />}/>
        <Route path='/accounts/get' element={<AccountGet />}/>
        
        <Route path="/accounts/confirm/:uid/:token" element={<ConfirmationPage />}/>
        <Route path="/accounts/password_reset_request" element={<PasswordResetRequestPage/>}/>
        <Route path="/accounts/password_reset/:uid/:token" element={<PasswordResetPage/>}/>
        <Route path="/meal/food" element={<FoodForm />}/>
        <Route path="/meal/food-list" element={<FoodList />}/>
        <Route path="/meal/searched-food-history" element={<SearchedFoodHistory />}/>
        <Route path="/meals/date/:date" element={<MealDate />}/>
        <Route path='/meal/food-search/:date/:meal_type' element={<FoodSearch />}/>

        <Route path="/user_info" element={<UserInfoForm />}/>
        <Route path="/exercise/workout-create" element={<WorkoutForm />}/>
        <Route path="/exercise/workout-list" element={<WorkoutList/>}/>
        <Route path="/exercise/exercise-create/:date" element={<ExerciseCreate />}/>
        <Route path="/exercise/date/:date" element={<ExerciseDate />}/>
        <Route path="/graph/weight-graph" element={<WeightGraph />}/>
        <Route path="/graph/body-fat-percentage-graph" element={<BodyFatPercentageGraph />}/>
        <Route path="/graph/muscle-mass-graph" element={<MuscleMassGraph />}/>
        <Route path="/graph/total-weight-graph" element={<ExerciseTotalWeightGraph />}/>
        <Route path="/graph/nutrients/:date" element={<DailyNutrientsGraph />}/>
        <Route path="/graph/daily-exercise-weight/:workout_type" element={<DailyExerciseWeightGraph />}/>
        <Route path="/graph/cals" element={<CalsGraph />}/>
        <Route path="/main/registration-status-check" element={<RegistrationStatusCheck />}/>
        <Route path="/main/cals-by-date/:date" element={<CalsByDate />}/>
        <Route path="/main/pfc-by-date/:date" element={<PFCByDate />}/>
      </Routes>
    </BrowserRouter>
      
      
      
    </div>
  );
}

export default App;

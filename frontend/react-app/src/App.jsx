import { useState, useEffect } from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

import './App.css';

import SignUp from './components/accounts/SignUp';
import Login from './components/accounts/Login';
import Meal from './components/meal/Meal';
import ConfirmationPage from './components/accounts/ConfirmationPage';
import PasswordResetRequestPage from './components/accounts/PasswordResetRequestPage';
import PasswordResetPage from './components/accounts/PasswordReset';

import FoodForm from './components/meal/FoodPost';
import FoodList from './components/meal/FoodList';

import MealDate from './components/meal/MealDate';

import UserInfoForm from './components/user_info/UserInfoFrom';

import WorkoutForm from './components/exercise/WorkoutForm';
import WorkoutList from './components/exercise/WorkoutList';

function App() {
  

  return (
    <div>

    <BrowserRouter>
      <Routes>
        
        <Route path='/accounts/signup' element={<SignUp />}/>
        <Route path='/accounts/login' element={<Login />}/>
        <Route path='/meals' element={<Meal />}/>
        <Route path="/accounts/confirm/:uid/:token" element={<ConfirmationPage />}/>
        <Route path="/accounts/password_reset_request" element={<PasswordResetRequestPage/>}/>
        <Route path="/accounts/password_reset/:uid/:token" element={<PasswordResetPage/>}/>
        <Route path="/meal/food" element={<FoodForm />}/>
        <Route path="/meal/food-list" element={<FoodList />}/>
        <Route path="/meals/date/:date" element={<MealDate />}/>
        <Route path="/user_info" element={<UserInfoForm />}/>
        <Route path="/exercise/workout-create" element={<WorkoutForm />}/>
        <Route path="/exercise/workout-list" element={<WorkoutList/>}/>
        

      </Routes>
    </BrowserRouter>
      
      
      
    </div>
  );
}

export default App;

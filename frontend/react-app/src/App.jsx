import { useState, useEffect } from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

import './App.css';
import AccountCreateForm from './components/accounts/CreateAccount';
import AccountList from './components/accounts/AccountList';
import SignUp from './components/accounts/SignUp';
import Login from './components/accounts/Login';
import Meal from './components/meal/Meal';
import ConfirmationPage from './components/accounts/ConfirmationPage';

function App() {
  

  return (
    <div>

    <BrowserRouter>
      <Routes>
        <Route path='accounts/list' element={<AccountList />}/>
        <Route path='/accounts/create' element={<AccountCreateForm />}/>
        <Route path='/accounts/signup' element={<SignUp />}/>
        <Route path='/accounts/login' element={<Login />}/>
        <Route path='/meals' element={<Meal />}/>
        <Route path="/confirm/:uid/:token" element={<ConfirmationPage />}/>
        
        
      </Routes>
    </BrowserRouter>
      
      
      
    </div>
  );
}

export default App;

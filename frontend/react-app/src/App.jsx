import { useState, useEffect } from 'react';
import './App.css';
import AccountCreateForm from './CreateAccount';
import AccountList from './AccountList';

function App() {
  

  return (
    <div>
      <AccountList />
      <AccountCreateForm />
    </div>
  );
}

export default App;

// src/components/Home.jsx
import React from 'react';

import useAuthCheck from '../hooks/useAuthCheck';
import Navigation from './Navigation';

const Dashboard = () => {
    useAuthCheck();

    return (
        
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
            <h1>Dashboard Page</h1>
            </div>
        
        </div>
        
    );
};

export default Dashboard;

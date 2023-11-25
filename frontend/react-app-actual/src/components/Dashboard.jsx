// src/components/Home.jsx
import React from 'react';

import useAuthCheck from '../hooks/useAuthCheck';
import Navigation from './Navigation';

const Dashboard = () => {
    useAuthCheck();

    return (
        
        <div>
            <Navigation />
        <h1>Dashboard Page</h1>
        
        
        </div>
        
    );
};

export default Dashboard;

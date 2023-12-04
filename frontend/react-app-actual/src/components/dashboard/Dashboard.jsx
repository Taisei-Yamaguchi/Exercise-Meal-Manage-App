// src/components/Home.jsx
import React from 'react';

import useAuthCheck from '../../hooks/useAuthCheck';
import Navigation from '../Navigation';
import Pet from './pet/Pet';

const Dashboard = () => {
    useAuthCheck();

    return (
        
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
            <h1>Dashboard Page</h1>
                <Pet />
            </div>
        
        </div>
        
    );
};

export default Dashboard;

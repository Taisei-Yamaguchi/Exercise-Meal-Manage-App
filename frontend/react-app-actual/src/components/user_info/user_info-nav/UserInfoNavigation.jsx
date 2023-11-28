// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// import CalsByDate from './CalsByDate';

const UserInfoNavigation = (onUpdate) => {
    const currentDate = new Date();
    const  date= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    return (
        <div className='user_info-nav'>
            <h1>User Info </h1>
            <h2>{date}</h2>
            {/* <Calendar selectedDate={date}  /> */}
            <div className='user_info-info'>
                {/* <PFCByDate selectedDate={date} onUpdate={onUpdate}/> */}
                {/* <CalsByDate selectedDate={date} onUpdate={onUpdate}/> */}
            </div>
            
            <div className='user_info-links'>
            <NavLink to='/user_info'>User Info Form</NavLink>
            <NavLink to='/user_info/weight-graph'>Weight Graph</NavLink>
            <NavLink to='/user_info/body-fat-percentage-graph'>Body Fat Graph</NavLink>
            <NavLink to='/user_info/muscle-mass-graph'>Muscle Mass Graph</NavLink>
            <NavLink to='/user_info/cals-graph'>Cals Graph</NavLink>
            </div>
        </div>
    );
};

// 他のコンポーネントをimportして使う部分は後で実装

export default UserInfoNavigation;

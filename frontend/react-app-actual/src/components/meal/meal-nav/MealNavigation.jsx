// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import PFCByDate from './PFCByDate';
import CalsByDate from './CalsByDate';

const MealNavigation = () => {
    const { date } = useParams();
    
    return (
        <div className='meal-nav'>
            <h1>Meal </h1>
            <h2>{date}</h2>
            <Calendar selectedDate={date}  />
            <div className='meal-info'>
                <PFCByDate selectedDate={date} />
                <CalsByDate selectedDate={date} />
            </div>
            
            <div className='meal-links'>
            <NavLink to={`/meal/food-create/${date}`}>Create Your Food</NavLink>
            
            <NavLink to={`/meal/${date}`}>Meal</NavLink>
            </div>
        </div>
    );
};

// 他のコンポーネントをimportして使う部分は後で実装

export default MealNavigation;

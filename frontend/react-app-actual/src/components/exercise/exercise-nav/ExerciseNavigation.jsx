// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import CalsByDate from '../../meal/meal-nav/CalsByDate';


const ExerciseNavigation = (onUpdate) => {
    const { date } = useParams();
    
    return (
        <div className='exercise-nav'>
            <h1>Exercise </h1>
            <h2>{date}</h2>
            <Calendar selectedDate={date}  />
            <div className='meal-info'>
                {/* <PFCByDate selectedDate={date} onUpdate={onUpdate}/> */}
                <CalsByDate selectedDate={date} onUpdate={onUpdate}/>
            </div>
            
            <div className='exercise-links'>
                <NavLink to={`/exercise/${date}`}>Exercise</NavLink>
                <NavLink to={`/exercise/exercise-total-weight-graph/${date}`}>Total Weight</NavLink>
                <NavLink to={`/exercise/daily-exercise-weight-graph/${date}/All`}>Daily Weight</NavLink>
            
            </div>
        </div>
    );
};

// 他のコンポーネントをimportして使う部分は後で実装

export default ExerciseNavigation;

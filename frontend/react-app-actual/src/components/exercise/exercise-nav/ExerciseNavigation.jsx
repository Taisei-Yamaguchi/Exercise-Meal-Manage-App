// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import CalsByDate from './CalsByDate';


const ExerciseNavigation = (onUpdate) => {
    const { date } = useParams();
    
    return (
        <div className='exercise-nav bg-gradient-to-r to-orange-400 from-red-500 text-neutral-100'>
            <h1>Exercise </h1>
            <Calendar selectedDate={date}  />
            <div className='exrcise-info'>
                {/* <PFCByDate selectedDate={date} onUpdate={onUpdate}/> */}
                <p>*Metsはカロリー計算の指標です。mins,sets,repsおよびUser Infoの最新の体重データ、性別から計算しています。</p>
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

// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import CalsByDate from './CalsByDate';
import Navigation from '../../Navigation';


const ExerciseNavigation = (onUpdate) => {
    const { date } = useParams();
    
    return (
        <div className='sub-nav bg-gradient-to-r from-orange-600 to-red-700 text-neutral-100'>
            <div className="drawer open-nav">
                <h1>Exercise </h1>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="btn btn-circle swap swap-rotate drawer-button">
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                    </label>
                </div> 
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <Navigation />
                </div>
            </div>
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

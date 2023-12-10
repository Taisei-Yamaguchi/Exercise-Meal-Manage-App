// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// import CalsByDate from './CalsByDate';
import Navigation from '../../Navigation';

const UserInfoNavigation = () => {
    const currentDate = new Date();
    const  date= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    return (
        <div className='sub-nav bg-gradient-to-r from-cyan-400 to-indigo-600 text-neutral-100'>
            <div className="drawer open-nav">
                <NavLink to='/user_info'><h1>User Info </h1></NavLink>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="btn btn-circle swap swap-rotate drawer-button">
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                    </label>
                </div> 
                <div className="drawer-side z-10">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <Navigation />
                </div>
            </div>
            <h2>{date}</h2>
            
            <div className='text-sm'>
                    <p>*基礎代謝が入力されない場合、体重、身長、年齢、性別から自動で計算されます</p>
                    <p>*ここのフォームでsave処理をしなかった日は、それ以前の最新日のデータが使用されます。</p>
            </div>

            <div role="tablist" className="tabs tabs-bordered">
                <NavLink to='/user_info' className="tab">Info Form</NavLink>
                <NavLink to='/user_info/weight-graph' className='tab'>Weight</NavLink>
                <NavLink to='/user_info/body-fat-percentage-graph' className='tab'>Body Fat</NavLink>
                <NavLink to='/user_info/muscle-mass-graph' className='tab'>Muscle Mass</NavLink>
                <NavLink to='/user_info/cals-graph' className='tab'>Cals</NavLink>
                
            </div>
        </div>
    );
};
export default UserInfoNavigation;

// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
// import CalsByDate from './CalsByDate';

const UserInfoNavigation = () => {
    const currentDate = new Date();
    const  date= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    return (
        <div className='user-info-nav'>
            <h1>User Info </h1>
            <h2>{date}</h2>
            <div className='user-info-detail'>
                <div className='user-info-info'>
                    <p>*基礎代謝が入力されない場合、体重、身長、年齢、性別から自動で計算されます</p>
                    <p>*ここのフォームでsave処理をしなかった日は、それ以前の最新日のデータが使用されます。</p>
                </div>
                <div className='user-info-links'>
                    <NavLink to='/user_info' className='user-info-link'>User Info Form</NavLink>
                    <NavLink to='/user_info/weight-graph' className='user-info-link'>Weight Graph</NavLink>
                    <NavLink to='/user_info/body-fat-percentage-graph' className='user-info-link'>Body Fat Graph</NavLink>
                    <NavLink to='/user_info/muscle-mass-graph' className='user-info-link'>Muscle Mass Graph</NavLink>
                    <NavLink to='/user_info/cals-graph' className='user-info-link'>Cals Graph</NavLink>
                </div>
            </div>
        </div>
    );
};

// 他のコンポーネントをimportして使う部分は後で実装

export default UserInfoNavigation;

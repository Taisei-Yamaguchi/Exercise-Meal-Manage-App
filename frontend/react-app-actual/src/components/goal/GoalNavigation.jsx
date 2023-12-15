// src/components/meal/MealNavigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Navigation from '../Navigation';
import formattedCurrentDate from '../../helpers/getToday';

const GoalNavigation = () => {
    
    return (
        <div className='sub-nav bg-gradient-to-r from-fuchsia-400 to-sky-500 text-neutral-100'>
            {/* head & nav ハンバ-ガー */}
            <div className="border-teal-100 mb-1 mt-1 flex flex-row  border rounded w-full justify-between">
                <NavLink to='/user_info' className='flex items-center'>
                    <img 
                    src='/icons/goal-icon.svg' 
                        className="swap-off fill-current w-8 h-8 mr-1" 
                    >
                    </img>
                    <h1>Goal</h1> 
                </NavLink> 

                <div className='flex items-center justify-between'>
                    {/* links */}

                    <NavLink to={`/meal/${formattedCurrentDate}`} className='flex items-center'>
                        <img 
                        src='/icons/meal-icon.svg' 
                            className="swap-off fill-current w-5 h-5 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <NavLink to={`/exercise/${formattedCurrentDate}`} className='flex items-center'>
                        <img 
                        src='/icons/exercise-icon.svg' 
                            className="swap-off fill-current w-5 h-5 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <NavLink to='/user_info' className='flex items-center'>
                        <img 
                        src='/icons/user-info-icon.svg' 
                            className="swap-off fill-current w-5 h-5 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <NavLink to='/goal' className='flex items-center'>
                        <img 
                        src='/icons/goal-icon.svg' 
                            className="swap-off fill-current w-5 h-5 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <NavLink to='/dashboard' className='flex items-center'>
                        <img 
                        src='/app-favicon.png' 
                            className="swap-off fill-current w-6 h-6 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <label htmlFor="my-drawer" className="bg-gradient-to-r from-stone-400 to-transparentbtn btn btn-circle swap swap-rotate drawer-button">
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
            </div>

            <h2>{formattedCurrentDate}</h2>
            
            <div className='text-sm'>
                    <p>*基礎代謝が入力されない場合、体重、身長、年齢、性別から自動で計算されます</p>
                    <p>*ここのフォームでsave処理をしなかった日は、それ以前の最新日のデータが使用されます。</p>
            </div>

            <div role="tablist" className="tabs tabs-bordered">
                <NavLink to='/user_info/weight-graph' className='tab link' activeclassname="link-warning">Weight</NavLink>
                <NavLink to='/user_info/body-fat-percentage-graph' className='tab link' activeclassname="link-warning">Body Fat</NavLink>
                <NavLink to='/user_info/muscle-mass-graph' className='tab link' activeclassname="link-warning">Muscle Mass</NavLink>
                <NavLink to='/user_info/cals-graph' className='tab link' activeclassname="link-warning">Cals</NavLink>
            </div>
        </div>
    );
};
export default GoalNavigation;

// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import PFCByDate from './PFCByDate';
import CalsByDate from './CalsByDate';
import FoodCreate from '../FoodCreate';

const MealNavigation = (onUpdate) => {
    const { date } = useParams();
    
    return (
        <div className='meal-nav bg-gradient-to-r from-lime-400 to-green-300 text-neutral-100 '>
            <h1>Meal </h1>
            <Calendar selectedDate={date}  />
            <ul className="menu lg:menu-horizontal rounded-box">
                <div className='meal-info'>
                    <PFCByDate selectedDate={date} onUpdate={onUpdate}/>
                    <CalsByDate selectedDate={date} onUpdate={onUpdate}/>
                </div>
                <div className='meal-links'>
                    {/* <NavLink to={`/meal/food-create/${date}`}>Create Your Food</NavLink> */}
                    <button className="btn btn-primary btn-xs" onClick={()=>document.getElementById('my_modal_4').showModal()}>Food Custom</button>
                        <dialog id="my_modal_4" className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button className="btn btn-circle btn-ghost absolute right-2 top-2 btn-sm">✕</button>
                                </form>
                                    <FoodCreate/>
                            </div>
                        </dialog>
                    <NavLink to={`/meal/${date}`}>Meal</NavLink>
                </div> 
            </ul>
                
            </div>
            
        
    );
};

// 他のコンポーネントをimportして使う部分は後で実装

export default MealNavigation;

// src/components/meal/MealNavigation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Calendar from './Calendar';
import PFCByDate from './PFCByDate';
import CalsByDate from './CalsByDate';
import FoodCreate from '../FoodCreate';
import Navigation from '../../Navigation';

const MealNavigation = (onUpdate) => {
    const { date } = useParams();
    
    return (
        <div className='sub-nav bg-gradient-to-r from-lime-400 to-green-300 text-neutral-100 '>

            {/* head & nav ハンバンガー */}
            <div className="drawer open-nav">
            <h1><NavLink to={`/meal/${date}`}>Meal</NavLink> </h1>
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
            
            {/* カレンダー */}
            <Calendar selectedDate={date}  />

            {/* Select 　Show*/}
            <div role="tablist" className="tabs tabs-lifted">
                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PFC" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10  text-zinc-900">
                    <PFCByDate selectedDate={date} onUpdate={onUpdate}/>
                </div>

                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Cal" checked/>
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10  text-zinc-900">
                    <CalsByDate selectedDate={date} onUpdate={onUpdate}/>
                </div>

                {/* <NavLink to={`/meal/food-create/${date}`}>Create Your Food</NavLink> */}
                <button role="tab" className="tab" onClick={()=>document.getElementById('my_modal_4').showModal()}>Create</button>
                        <dialog id="my_modal_4" className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button className="btn btn-circle btn-ghost absolute right-2 top-2 btn-sm">✕</button>
                                </form>
                                    <FoodCreate/>
                            </div>
                        </dialog>
            </div>
        </div>
    );
};

export default MealNavigation;

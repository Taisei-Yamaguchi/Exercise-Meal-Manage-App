// src/components/Home.jsx
import React from 'react';

import useAuthCheck from '../../hooks/useAuthCheck';
import Navigation from '../Navigation';
import Pet from './pet/Pet';
import { NavLink } from 'react-router-dom';
import MainCalendar from '../calendar/MainCalendar';

const Dashboard = () => {
    useAuthCheck();

    const currentDate = new Date();
    const  selectedDate= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    
    
    return (
        <div className='container'>
            <div className='sub-container' style={{ backgroundImage: 'url(/pets-bg/forest.jpg)' }}>
                <div className="hero min-h-screen ">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <div className="drawer open-nav">
                            <h1 className="text-5xl font-bold">Welcome! </h1>
                            {/* <p className="py-6 text-red-600"> 
                                食事、運動の記録を続けてあなたのペットを育てよう！<br></br>食
                                習慣、運動習慣、User Infoに基づいていろんな姿に変わる！
                            </p> */}
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
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 ">
                        <div className="card-body " >
                            <div className='flex flex-row justify-between'>
                                <img 
                                    src='/icons/calendar.svg' 
                                    className="swap-off fill-current w-10 h-10 cursor-pointer" 
                                    onClick={() => document.getElementById(`my_modal_calendar`).showModal()}>
                                </img> 
                                <dialog id={`my_modal_calendar`} className="modal">
                                    <div className="modal-box text-slate-500">
                                        <MainCalendar  month={`${selectedDate.split('-').slice(0,2).join('-')}`}/>
                                    </div>
                                    <form method="dialog" className="modal-backdrop">
                                        <button >✕</button>
                                    </form>
                                </dialog>

                                <NavLink to={`/meal/${selectedDate}`}>
                                    <img 
                                        src='/icons/meal-icon.svg' 
                                        className="swap-off fill-current w-10 h-10 " 
                                        >
                                    </img> 
                                </NavLink>

                                <NavLink to={`/exercise/${selectedDate}`}>
                                    <img 
                                        src='/icons/exercise-icon.svg' 
                                        className="swap-off fill-current w-10 h-10" 
                                        >
                                    </img> 
                                </NavLink>

                                <NavLink to='/user_info'>
                                    <img 
                                        src='/icons/user-info-icon.svg' 
                                        className="swap-off fill-current w-10 h-10" 
                                        >
                                    </img> 
                                </NavLink>
                                
                            </div>
                            <Pet />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

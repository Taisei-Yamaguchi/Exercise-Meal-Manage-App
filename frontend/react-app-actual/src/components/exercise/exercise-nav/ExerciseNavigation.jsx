import React  from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import CalsByDate from '../../sub/CalsByDate';
import Navigation from '../../Navigation';
import NavCalendar from '../../sub/NavCalendar';


const ExerciseNavigation = () => {
    const { date } = useParams();
    
    // render
    return (
        <div className='sub-nav bg-gradient-to-r from-orange-600 to-red-700 text-neutral-100'>
            {/* head & nav ハンバ-ガー */}
            <div className="border-teal-100 mb-1 mt-1 flex flex-row  border rounded w-full justify-between">
                <NavLink to={`/exercise/${date}`} className='flex items-center'>
                    <img 
                    src='/icons/exercise-icon.svg' 
                        className="swap-off fill-current w-8 h-8 mr-1" 
                    >
                    </img>
                    <h1>Exercise</h1> 
                </NavLink> 

                <div className='flex items-center justify-between'>
                    {/* links */}
                    {/* <NavLink to={`/exercise/${formattedCurrentDate}`} className='flex items-center'>
                        <strong className='w-5 h-5'>today</strong>
                    </NavLink> */}

                    <NavLink to={`/meal/${date}`} className='flex items-center'>
                        <img 
                        src='/icons/meal-icon.svg' 
                            className="swap-off fill-current w-5 h-5 mr-1" 
                        >
                        </img>
                    </NavLink>

                    <NavLink to={`/exercise/${date}`} className='flex items-center'>
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


            {/* カレンダー */}
            <NavCalendar selectedDate={date}  btnColorClass={'btn-accent'}/>
            {/* メッセージ */}
            <p className='text-xs'>*Mets is a calorie calculation index. 
            Calorie is calculated from the latest weight data from mins,sets,reps and User Info, and gender and mets.
            </p>

            {/* Select 　Show*/}
            <div role="tablist" className="z-0 tabs tabs-lifted">

                <input type="radio" name="my_tabs_2" role="tab" className="tab w-10" aria-label="Cal" defaultChecked/>
                <div className="bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10  text-zinc-900">
                    <CalsByDate selectedDate={date} />
                </div>
                
                <input type="radio" name="my_tabs_2" role="tab" className="tab w-10" aria-label="Graph" defaultChecked/>
                <div className="bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10 text-zinc-900">
                    <NavLink to={`/exercise/exercise-total-weight-graph/${date}`} className="tab">Total</NavLink>
                    <NavLink to={`/exercise/daily-exercise-weight-graph/${date}/All`} className="tab">Daily </NavLink>
                </div>
            </div>
        </div>
    );
};

export default ExerciseNavigation;

import React from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import NavCalendar from '../../sub/navCalendar';
import PFCByDate from './PFCByDate';
import CalsByDate from '../../sub/CalsByDate';
import FoodCreate from '../FoodCreate';
import Navigation from '../../Navigation';

import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { setToastMes } from '../../../redux/store/ToastSlice';

const MealNavigation = () => {
    const { date } = useParams();
    const dispatch= useDispatch()
    const toastMes = useSelector((state) => state.toast.toastMes);
    const toastClass = useSelector((state) => state.toast.toastClass);
    
    // clear toastMes
    const clearToastMes = ()=>{
        dispatch(setToastMes(''))
    }

    // render
    return (
        <div className='sub-nav bg-gradient-to-r from-lime-400 to-green-300 text-neutral-100 '>
            {/* head & nav ハンバ-ガー */}
            <div className="border-teal-100 mb-1 mt-1 flex flex-row  border rounded w-full justify-between">
                <NavLink to={`/meal/${date}`} className='flex items-center'>
                    <img 
                    src='/icons/meal-icon.svg' 
                        className="swap-off fill-current w-8 h-8 mr-1" 
                    >
                    </img>
                    <h1>Meal</h1> 
                </NavLink> 

                <div className='flex items-center justify-between'>
                    {/* links */}

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
            <NavCalendar selectedDate={date}  btnColorClass={'btn-primary'}/>

            {/* Select 　Show*/}
            <div role="tablist" className="tabs tabs-lifted">
                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="PFC" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10  text-zinc-900">
                    <PFCByDate selectedDate={date} />
                </div>

                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Cal" defaultChecked/>
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box w-screen p-6 tab-content p-10  text-zinc-900">
                    <CalsByDate selectedDate={date} />
                </div>

                {/* <NavLink to={`/meal/food-create/${date}`}>Create Your Food</NavLink> */}
                <button role="tab" className="tab" onClick={()=>document.getElementById('my_modal_4').showModal()}>Create</button>
                        <dialog id="my_modal_4" className="modal">
                            <div className="modal-box">
                                <FoodCreate/>
                            </div>
                            <form method="dialog" className="modal-backdrop" onClick={clearToastMes}>
                                    <button >✕</button>
                                </form>

                                {/* toast mes */}
                                {toastMes && toastMes !=='' &&(
                                    <div className="toast">
                                        <div className={`alert ${toastClass}`}>
                                                <span>{toastMes}</span>
                                        </div>
                                    </div>)}
                        </dialog>
            </div>
        </div>
    );
};

export default MealNavigation;

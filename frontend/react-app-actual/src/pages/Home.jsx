// src/components/Home.jsx
import React from 'react';
import Navigation from '../components/Navigation';
import { NavLink } from 'react-router-dom';

const Home = () => {
    
    return (
        <div className='container'>
            <div className='sub-container'>
                <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <div className="drawer open-nav">
                            <h1 className="text-5xl font-bold">Home!</h1>
                            <input id="my-drawer" type="checkbox" className=" drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer" className=" bg-gradient-to-r from-stone-400 to-transparentbtn btn-circle swap swap-rotate drawer-button">
                                    {/* this hidden checkbox controls the state */}
                                    <input type="checkbox" />
                                    <svg className=" swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
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
                        <div className=" card-body">
                            <NavLink to='/login'>Go Login Page !</NavLink>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

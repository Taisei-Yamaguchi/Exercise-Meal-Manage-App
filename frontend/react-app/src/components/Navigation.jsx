// Navigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function Navigation() {
    const [showNav, setShowNav] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    const handleNavClick = () => {
        setShowNav(!showNav);
    };


    return (
        <nav>
            <h1 onClick={windowWidth <= 765 ? handleNavClick : null}>EMMA</h1>
            <ul className={showNav ? 'show' : ''}>
                <li>
                    <p><NavLink to="/accounts/signup" className='nav-link' activeclassname="active">Sign Up</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/accounts/login" className='nav-link' activeclassname="active">Log In</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/meals" className='nav-link' activeclassname="active">Meals</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/meal/food" className='nav-link' activeclassname="active">Food Post</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/meal/food-list" className='nav-link' activeclassname="active">Food List</NavLink></p>
                </li>
                <li>
                    <p><NavLink to={`/meals/date/${formattedDate}`} className='nav-link' activeclassname="active">Meals Today</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/exercise/workout-create" className='nav-link' activeclassname="active">Workout Post</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/exercise/workout-list" className='nav-link' activeclassname="active">Workout List</NavLink></p>
                </li>
                <li>
                    <p><NavLink to="/user_info" className='nav-link' activeclassname="active">User Info</NavLink></p>
                </li>
                <li>
                    <p><NavLink to={`/exercise/date/${formattedDate}`} className='nav-link' activeclassname="active">Exercise List</NavLink></p>
                </li>
                <li>
                <p><NavLink to="/graph/weight-graph" className='nav-link' activeclassname="active">Weight Graph</NavLink></p>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;

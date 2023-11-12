// Navigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function Navigation() {
    const [showNav, setShowNav] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


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
            </ul>
        </nav>
    );
}

export default Navigation;

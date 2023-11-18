// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
    const [showNav, setShowNav] = useState(false);

    const workout_type='Chest';

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    const handleNavClick = () => {
        setShowNav(!showNav);
    };

    const navLinks = [
        { to: "/accounts/signup", label: "Sign Up" },
        { to: "/accounts/login", label: "Log In" },
        { to: "/meals", label: "Meals" },
        { to: "/meal/food", label: "Food Post" },
        { to: "/meal/food-list", label: "Food List" },
        { to: `/meals/date/${formattedDate}`, label: "Meals Today" },
        { to: "/exercise/workout-create", label: "Workout Post" },
        { to: "/exercise/workout-list", label: "Workout List" },
        { to: "/user_info", label: "User Info" },
        { to: `/exercise/date/${formattedDate}`, label: "Exercise List" },
        { to: "/graph/weight-graph", label: "Weight Graph" },
        { to: "/graph/body-fat-percentage-graph", label: "Body Fat Graph" },
        { to: "/graph/muscle-mass-graph", label: "Muscle Mass Graph" },
        { to: "/graph/total-weight-graph", label: "Exercise Total Weight Graph" },
        { to: `/graph/nutrients/${formattedDate}`, label: "Daily Nutrients Graph" },
        { to: `/graph/daily-exercise-weight/${workout_type}`, label: "Daily Exercise Weight Graph" },
    ];

    return (
        <nav>
            <h1 className='nav-toggle' onClick={handleNavClick}>EMMA</h1>
            {/* <div className="menu-toggle" onClick={handleNavClick}>
                Menu
            </div> */}
            <ul className={`nav-menu ${showNav ? 'show' : ''}`}>
                {navLinks.map((link, index) => (
                    <li key={index}>
                        <p>
                            <NavLink to={link.to} className='nav-link' activeclassname="active">
                                {link.label}
                            </NavLink>
                        </p>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigation;

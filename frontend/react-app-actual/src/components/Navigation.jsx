// 例: components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './account/Logout';

const Navigation = () => {

    const currentDate = new Date();
    const  formattedCurrentDate= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
        const yourAuthToken = localStorage.getItem('authToken');
    return (
        <nav className='flex flex-col items-center menu-nav z-50 bg-gradient-to-r from-stone-400 to-transparent text-slate-100'>
        <ul>
            <li>
            <Link to="/">Home</Link>
            </li>
            {yourAuthToken &&
            <div>
                
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to={`/meal/${formattedCurrentDate}`}>Meal</Link>
                </li>
                <li>
                    <Link to={`/exercise/${formattedCurrentDate}`}>Exercise</Link>
                </li>
                <li>
                    <Link to="/user_info">User Info</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li>
                    <LogoutButton />
                </li>
            </div>
            }

            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/signup">Sign Up</Link>
            </li>

        </ul>
        </nav>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Navigation);

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
        <nav className='menu-nav'>
        <ul>
            <li>
            <Link to="/">Home</Link>
            </li>
            
            <li>
                <Link to="/login">login</Link>
            </li>
            <li>
                <Link to="/signup">sign up</Link>
            </li>
            <hr></hr>
            {yourAuthToken &&
            <div>
                <li>
                    <LogoutButton />
                </li>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to={`/meal/${formattedCurrentDate}`}>Meal</Link>
                </li>
                <li>
                    <Link to={`/exercise/${formattedCurrentDate}`}>Exercise</Link>
                </li>
                
            </div>
            }

        </ul>
        </nav>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Navigation);

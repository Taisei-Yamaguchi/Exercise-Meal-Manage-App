// 例: components/Navigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogoutButton from './account/Logout';

const Navigation = () => {

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

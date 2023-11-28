import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';


const RegistrationStatusCheck = () => {
    const [data, setData] = useState([]);   

    // API経由でログインユーザーのmealを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/main/registration-status-check/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setData(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching data.:', error);
        }
    };

    useAuthCheck(fetchData)

    return (
        <div>
            <Navigation />
            <h1>Registration Status Check</h1>
            

            <div>
                
            </div>
        </div>
    );
};

export default RegistrationStatusCheck;

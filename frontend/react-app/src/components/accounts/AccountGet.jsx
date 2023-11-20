import React, { useState } from 'react';
import Navigation from '../Navigation';
import getCookie from '../helpers/getCookie';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AccountGet = () => {
    const [userData, setUserData] = useState({});
    const [mes,setMes] =useState('')
    const navigate= useNavigate()

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken');
        if (!yourAuthToken) {
            console.log('Token Error');
            navigate('../accounts/login');
        }else{
            fetchAccount()
        }
    }, []);

    const fetchAccount = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/accounts/get/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });
            const data = await response.json();

            console.log(data); // サーバーからのレスポンスをログ出力
            
            setMes('Update Success')
        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    

    return (
        <div>
            <Navigation />
            <h1>Account Info</h1>
        </div>
    );
};

export default AccountGet;

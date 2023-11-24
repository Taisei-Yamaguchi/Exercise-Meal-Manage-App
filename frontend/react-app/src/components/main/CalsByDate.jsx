import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import { useParams } from 'react-router-dom';

import getCookie from '../helpers/getCookie';



const CalsByDate = () => {
    const { date } = useParams();
    const [data, setData] = useState([]);
    const navigate=useNavigate()
    

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else {
            console.log(date)
            fetchData(); // トークンを使用して食事情報を取得
        }
    }, []);
    

    // API経由でログインユーザーのmealを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/main/cals-by-date/?date=${date}`, {
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



    return (
        <div>
            <Navigation />
            <h1>Cals By Date {date}</h1>
            <h2>{date}</h2>
            </div>
        );
        
};

export default CalsByDate;

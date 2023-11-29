import React, { useState, useEffect } from 'react';
import getCookie from '../../../hooks/getCookie';


const CalsByDate = ({ selectedDate,onUpdate}) => {
    
    const [calsData, setCalsData] = useState([]);
    
    useEffect(() => {
        fetchData()
    }, [selectedDate,onUpdate]);

    

    // API経由でログインユーザーのpfcを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/main/cals-by-date/?date=${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setCalsData(data);
        } catch (error) {
            console.error('Error fetching data.:', error);
        }
    };
    
    

    return (
        <div>
            
            <ul className='daily-cals'>
                <li>Intake: {Math.round(calsData.intake_cals)}kcal</li>
                <li>Consuming: {Math.round(calsData.bm_cals+calsData.exercise_cals+calsData.food_cals)}kcal (Exercise:{Math.round(calsData.exercise_cals)}kcal)</li>
                
            </ul>
            
        </div>
        );
        
};

export default CalsByDate;

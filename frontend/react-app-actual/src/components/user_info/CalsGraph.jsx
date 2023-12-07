import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../hooks/getCookie';
import { Bar,Line } from 'react-chartjs-2';
import Navigation from '../Navigation';
import UserInfoNavigation from './user_info-nav/UserInfoNavigation';

const CalsGraph = () => {
    const [intakeCals, setIntakeCals] = useState([]);
    const [consumingCals, setConsumingCals] =useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/graph/cals-graph/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
            });

            if (!response.ok) {
            throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setIntakeCals(data.intake_cals);
            setConsumingCals(data.consuming_cals);
            
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません
    
    

    const data = {
        labels: consumingCals.map(entry => entry.date),
        datasets: [
            {
                label: 'Exercise Calories',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                data: consumingCals.map(entry => entry.exercise_consuming_cals),
            },
            {
                label: 'BM Calories',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                data: consumingCals.map(entry => entry.bm_consuming_cal),
            },
            {
                label: 'Food Calories',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                data: consumingCals.map(entry => entry.food_consuming_cal),
            },
            {
                label: 'Intake Calories',
                type: 'line',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: intakeCals.map(entry => entry.total_cal),
                fill: false,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    return (
        <div className='container'>
            <div className='sub-container '>
                <UserInfoNavigation />
                <div className='main'>    
                    <h1>Cals Graph</h1>
                    <Bar data={data} height={300} options={options}/>
                </div>
            </div>
        </div>
    );
};

export default CalsGraph;

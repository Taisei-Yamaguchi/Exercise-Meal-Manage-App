import getCookie from '../helpers/getCookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';


const WorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [default_workouts,setDefaultWorkouts] = useState([]);
    const navigate= useNavigate()
    
    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else{
            fetchWorkouts()
        }
    }, []);

    const fetchWorkouts = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/exercise/get-workout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setWorkouts(data.workout);
            setDefaultWorkouts(data.default_workout)
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
        };

    return (
        <div>
            <Navigation />
            <h2>Workout List</h2>
            <ul>
                {workouts.map((workout) => (
                <li key={workout.id}>({workout.id}){workout.name} - {workout.workout_type}</li>
                ))}
                {default_workouts.map((workout) => (
                <li key={workout.id}>({workout.id}){workout.name} - {workout.workout_type}</li>
                ))}
            </ul>
        </div>
    );
    };

    export default WorkoutList
import React, { useState, useEffect } from 'react';
import getCookie from '../helpers/getCookie';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = () => {
    const [workoutName, setWorkoutName] = useState('');
    const [workoutType, setWorkoutType] = useState('');
    const navigate= useNavigate()

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } 
    }, []);

    const handleCreateWorkout = async () => {
        try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://127.0.0.1:8000/exercise/post-workout/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
            'X-CSRFToken': getCookie('csrftoken') ,
            },
            body: JSON.stringify({ name: workoutName, workout_type: workoutType }),
        });

        const data = await response.json();
        console.log('Workout created successfully:', data);
        } catch (error) {
        console.error('Error creating workout:', error);
        }
    };

    return (
        <div>
            <Navigation />
        <h2>Create Workout</h2>
        <label>Name: </label>
        <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
        />
        <br />
        <label>Type: </label>
        <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
        />
        <br />
        <button onClick={handleCreateWorkout}>Create Workout</button>
        </div>
    );
    };

    
    

export default WorkoutForm;

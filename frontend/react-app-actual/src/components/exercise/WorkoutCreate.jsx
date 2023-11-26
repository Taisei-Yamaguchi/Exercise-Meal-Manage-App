import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import { useNavigate } from 'react-router-dom';

const WorkoutCreate = ({workoutType}) => {
    const [workoutName, setWorkoutName] = useState('');    

    useAuthCheck();

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
            <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
            />
            
            <button onClick={handleCreateWorkout}>Create Workout</button>
        </div>
    );
    };

    
    

export default WorkoutCreate;

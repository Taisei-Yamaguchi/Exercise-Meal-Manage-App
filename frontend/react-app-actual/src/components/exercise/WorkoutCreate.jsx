import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import { useNavigate } from 'react-router-dom';
import { useFetchWorkoutContext } from '../../hooks/fetchWorkoutContext';

const WorkoutCreate = ({workoutType}) => {
    const [workoutName, setWorkoutName] = useState('');    

    useAuthCheck();

    const { toggleWorkoutCreateTrigger } = useFetchWorkoutContext();

    const handleCreateWorkout = async (e) => {
        e.preventDefault()
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
        setWorkoutName('')
        toggleWorkoutCreateTrigger()
        } catch (error) {
        console.error('Error creating workout:', error);
        }
    };

    return (
        <form onSubmit={handleCreateWorkout}>
            
            <div className="join">
                <input 
                    className="input input-bordered join-item input-sm" 
                    placeholder="new Custom Workout"
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    required
                    pattern="\S+" // スペース以外の文字が1文字以上必要
                    title="スペースのみの入力は無効です"
                />
                <button type='submit' className="btn join-item rounded-r-full btn-sm">Add</button>
            </div>
        </form>
    );
    };

    
    

export default WorkoutCreate;

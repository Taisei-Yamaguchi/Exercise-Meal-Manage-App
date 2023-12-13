import React, { useState } from 'react';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';


const LatestExerciseByType = ({exercise_date,workout_type, onUpdate }) => {
    
    const [latestExercises,setLatestExercises] =useState([])

    // 最新meal
    const fetchLatestExercises = async() => {
        const yourAuthToken = localStorage.getItem('authToken'); 
        fetch(`http://127.0.0.1:8000/exercise/get-latest-exercise/?workout_type=${workout_type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${yourAuthToken}`, // トークンを設定
                'X-CSRFToken': getCookie('csrftoken') ,
                // 'X-UserId': user_id,
            },
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch exercises');
        })
        .then(data => {
            setLatestExercises(data.exercises);
            console.log('最新',latestExercises)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    useAuthCheck(fetchLatestExercises);


    const handleCreateExercise = async (e) => {
        const yourAuthToken = localStorage.getItem('authToken');
        try {
        const response = await fetch('http://127.0.0.1:8000/exercise/create-latest-exercise/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${yourAuthToken}`, // トークンを設定
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            body: JSON.stringify({
                workout_type: workout_type,
                exercise_date: exercise_date,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Exercise created successfully:', data);
            fetchLatestExercises()
            onUpdate()
        } else {
            console.error('Failed to create exercise:', response.statusText);
        }
        } catch (error) {
        console.error('Error creating exercise:', error.message);
        }
    };



    return (
        <div className='relative'>
        <div className="dropdown dropdown-right dropdown-hover z-50">
            <img 
                src='/icons/copy.svg'
                tabIndex={0} 
                className=" m-1 h-5 w-5" 
                onClick={handleCreateExercise}>    
            </img>
            
            <ul tabIndex={0} className="absolute top-full left-0 dropdown-content z-30 menu p-2 shadow bg-base-100 rounded-box w-52">
                
                {latestExercises.map((exercise)=>(
                    <li>{exercise.workout.name}</li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default LatestExerciseByType;

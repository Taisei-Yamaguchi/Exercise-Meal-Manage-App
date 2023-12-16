import React, { useEffect, useState } from 'react';
import getCookie from '../../hooks/getCookie';
// import useAuthCheck from '../../hooks/useAuthCheck';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setExerciseLoading } from '../../redux/store/LoadingSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';


const LatestExerciseByType = ({exercise_date,workout_type}) => {
    const dispatch = useDispatch()
    const exerciseLoading =useSelector((state) => state.loading.exerciseLoading)

    const [latestExercises,setLatestExercises] =useState([])

    useEffect(()=>{
        fetchLatestExercises()
    },[exerciseLoading])

    // 最新meal
    const fetchLatestExercises = async() => {
        const authToken = localStorage.getItem('authToken')
        fetch(`${BACKEND_ENDPOINT}/exercise/get-latest-exercise/?workout_type=${workout_type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authToken}`, // トークンを設定
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
            console.log('success fetchLatestExercise!')
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    const handleCreateExercise = async (e) => {
        try {
        dispatch(setExerciseLoading(true))
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/exercise/create-latest-exercise/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`, // トークンを設定
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
            
        } else {
            console.error('Failed to create exercise:', response.statusText);
        }
        } catch (error) {
            console.error('Error creating exercise:', error.message);
        } finally{
            dispatch(setExerciseLoading(false))
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
                {workout_type !== 'Living' ? (
                    latestExercises.map((exercise) => (
                        <li key={exercise.id}>{exercise.workout.name}</li>
                    ))
                ) : (
                    latestExercises.map((exercise) => (
                        <li key={exercise.id}>{`${exercise.workout.name}-${exercise.mets}Mets(${exercise.duration_minutes} mins)`}</li>
                    ))
                )}
            </ul>
        </div>
        </div>
    );
};

export default LatestExerciseByType;

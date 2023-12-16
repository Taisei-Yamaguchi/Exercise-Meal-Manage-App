import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
// import useAuthCheck from '../../hooks/useAuthCheck';

import { BACKEND_ENDPOINT } from '../../settings';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../../redux/store/ToastSlice';
import { setToastClass } from '../../redux/store/ToastSlice';
import { setModalLoading } from '../../redux/store/LoadingSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setWorkoutLoading } from '../../redux/store/LoadingSlice';


const WorkoutCreate = ({workoutType}) => {
    const [workoutName, setWorkoutName] = useState('');    

    const dispatch =useDispatch()
    const modalLoading = useSelector((state) => state.loading.modalLoading)

    const handleCreateWorkout = async (e) => {
        e.preventDefault()
        try {
        dispatch(setToastMes(''))
        dispatch(setModalLoading(true))
        dispatch(setWorkoutLoading(true))

        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/exercise/post-workout/`, {
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

        if(response.ok){
            dispatch(setToastMes('Created Workout Successfully!'))
            dispatch(setToastClass('alert-info'))
        }else{
            console.error('Error creating workout:', error);
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
        }
        
        } catch (error) {
            console.error('Error creating workout:', error);
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
        } finally {
            dispatch(setModalLoading(false))
            dispatch(setWorkoutLoading(false))
        }
    };

    return (
        <form onSubmit={handleCreateWorkout}>
            { modalLoading ? (
                <span className="loading loading-dots loading-lg"></span>
            ):(
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
            )}
        </form>
    );
    };

export default WorkoutCreate;

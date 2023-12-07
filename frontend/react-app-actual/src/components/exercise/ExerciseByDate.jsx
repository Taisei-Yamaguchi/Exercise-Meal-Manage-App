import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import ExerciseCreate from './ExerciseCreate';
import ExerciseDelete from './ExerciseDelete';
import ExerciseUpdate from './ExerciseUpdate';
import ExerciseNavigation from './exercise-nav/ExerciseNavigation';
import WorkoutCreate from './WorkoutCreate';

const ExerciseByDate = () => {
    const navigate = useNavigate();
    const { date } = useParams();
    const [exerciseData, setExerciseData] = useState([]);
    // const [defaultExerciseData, setDefaultExerciseData] = useState([]);
    const workoutTypes = ['Chest', 'Back', 'Shoulder', 'Arm','Leg','Abs','Aerobic','Other'];
    
    const [loading, setLoading] = useState(true);
    const [updateTrigger, setUpdateTrigger] = useState(false);

    
    
    const fetchExerciseData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/exercise/get-exercise-date/?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exercise data');
            }

            const data = await response.json();
            
            setExerciseData(data.exercise);
            

        } catch (error) {
            console.error('Error fetching exercise data:', error);
        } finally {
            // fetchが完了したらloadingをfalseに設定
            setLoading(false);
        }
    };


    useAuthCheck(fetchExerciseData)

    useEffect(()=>{
        fetchExerciseData()
    },[updateTrigger])

    const handleUpdate = () => {
        // 何らかのアクションが発生した時にupdateTriggerをトグル
        setUpdateTrigger((prev) => !prev);
        
    };

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container exercise-main-container'>
            <ExerciseNavigation onUpdate={handleUpdate}/>
            
                <div className='main exercise-main'>
                    {workoutTypes.map((workoutType)=>(
                        <div key={workoutType} className='exercise-group '>
                            <h2><strong>{workoutType}</strong></h2>
                            <ExerciseCreate exercise_date={date} workoutType={workoutType} onUpdate={handleUpdate}/>
                            
                            <table className="table table-xs table-pin-rows table-pin-cols">
                            <div className="collapse">
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-primary-content">
                                    <label className="swap">
                                    <input type="checkbox" />
                                    <div className="swap-on">
                                    <thead>
                                        <tr>
                                        <td>Exercise lists...</td>
                                        </tr>
                                    </thead>
                                    </div>
                                    <div className="swap-off">
                                        <thead>
                                        <tr>
                                        <td>Exercise lists...</td>
                                        </tr>
                                        </thead>
                                    </div>
                                    </label>
                                </div>
                                <div className="collapse-content text-primary-content ">
                                    <div className="overflow-x-auto">
                                        <tbody className='bg-pink-50'>
                                            {exerciseData
                                                .filter((exercise)=>exercise.workout.workout_type === workoutType)
                                                .map((exercise)=>(
                                                    <tr key={exercise.id} className='bg-pink-200'>
                                                        <td><strong>{exercise.workout.name}</strong></td>
                                                        <td><ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType} exerciseData={exercise} onUpdate={handleUpdate}/>
                                                        </td>
                                                        <td><ExerciseDelete exerciseId={exercise.id} onUpdate={handleUpdate}/></td>
                                                    </tr>
                                                ))}
                                                
                                        </tbody>
                                    </div>
                                </div>
                            </div>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExerciseByDate;

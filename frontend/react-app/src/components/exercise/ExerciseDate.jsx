import React, { useState, useEffect } from 'react';
import getCookie from '../helpers/getCookie';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../Navigation';
import ExerciseCreate from './ExerciseCreate';

const ExerciseDate = () => {
    const navigate = useNavigate();
    const { date } = useParams();
    const [exerciseData, setExerciseData] = useState([]);
    const [defaultExerciseData, setDefaultExerciseData] = useState([]);
    const workoutTypes = ['Chest', 'Back', 'Shoulder', 'Arm','Leg','Abs','Other'];
    const workoutType_aerobic ='Aerobic';

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken');
        if (!yourAuthToken) {
            console.log('Token Error');
            navigate('../accounts/login');
        } else {
            fetchExerciseData();
        }
    }, []);

    
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

            setExerciseData(data.w_exercise);
            setDefaultExerciseData(data.d_exercise);

        } catch (error) {
            console.error('Error fetching exercise data:', error);
        }
    };

    return (
        <div>
            <Navigation />
            <h2>Exercise Data by Date</h2>
            <h3>{date}</h3>
            <div>
                {workoutTypes.map((workoutType)=>(
                    <div key={workoutType} className='exercise-group'>
                        <h2>{workoutType}</h2>
                        <ExerciseCreate exercise_date={date} workoutType={workoutType}/>
                        {exerciseData
                        .filter((exercise)=>exercise.workout.workout_type === workoutType)
                        .map((exercise)=>(
                            <div key={exercise.id} className={`each-exercise ${workoutType}`}>
                                <p>Date : {exercise.exercise_date}</p>
                                <p>Exercise : {exercise.workout.name}</p>
                                
                            </div>
                        ))}

                        {defaultExerciseData
                        .filter((exercise)=>exercise.default_workout.workout_type === workoutType)
                        .map((exercise)=>(
                            <div key={exercise.id} className={`each-exercise ${workoutType}`}>
                                <p>Date : {exercise.exercise_date}</p>
                                <p>Exercise : {exercise.default_workout.name}</p>
                                
                            </div>
                        ))}
                    </div>
                ))}
                    <div key={workoutType_aerobic} className='exercise-group'>
                        <h2>{workoutType_aerobic}</h2>
                        <ExerciseCreate exercise_date={date} workoutType={workoutType_aerobic}/>
                        {exerciseData
                        .filter((exercise)=>exercise.workout.workout_type === workoutType_aerobic)
                        .map((exercise)=>(
                            <div key={exercise.id} className={`each-exercise ${workoutType_aerobic}`}>
                                <p>Date : {exercise.exercise_date}</p>
                                <p>Exercise : {exercise.workout.name}</p>
                                
                            </div>
                        ))}

                        {defaultExerciseData
                        .filter((exercise)=>exercise.default_workout.workout_type === workoutType_aerobic)
                        .map((exercise)=>(
                            <div key={exercise.id} className={`each-exercise ${workoutType_aerobic}`}>
                                <p>Date : {exercise.exercise_date}</p>
                                <p>Exercise : {exercise.default_workout.name}</p>
                                
                            </div>
                        ))}
                    </div>

                {/* {exerciseData.map((exercise) => (
                    <div key={exercise.id}>
                        <p>Date : {exercise.exercise_date}</p>
                        <p>Exercise : {exercise.workout.name}</p>
                        <p>Part : {exercise.workout.workout_type}</p>
                    </div>
                ))}
                {defaultExerciseData.map((exercise) => (
                    <div key={exercise.id}>
                        <p>Date : {exercise.exercise_date}</p>
                        <p>Exercise : {exercise.default_workout.name}</p>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default ExerciseDate;

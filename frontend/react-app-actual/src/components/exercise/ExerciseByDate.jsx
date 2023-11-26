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
    const [defaultExerciseData, setDefaultExerciseData] = useState([]);
    const workoutTypes = ['Chest', 'Back', 'Shoulder', 'Arm','Leg','Abs','Other'];
    const workoutType_aerobic ='Aerobic';
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        // fetchExerciseDataが完了したら実行される
        // exerciseDataとdefaultExerciseDataが設定された後に実行される
        console.log('Data has been updated:', exerciseData, defaultExerciseData);
    }, [exerciseData, defaultExerciseData]);

    
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
            console.log(data)
            setExerciseData(data.w_exercise);
            setDefaultExerciseData(data.d_exercise);

        } catch (error) {
            console.error('Error fetching exercise data:', error);
        } finally {
            // fetchが完了したらloadingをfalseに設定
            setLoading(false);
        }
    };

    useAuthCheck(fetchExerciseData)

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container exercise-main-container'>
            <ExerciseNavigation />
            
                <div>
                    {workoutTypes.map((workoutType)=>(
                        <div key={workoutType} className='exercise-group'>
                            <h2>{workoutType}</h2>
                            <ExerciseCreate exercise_date={date} workoutType={workoutType}/>
                            <WorkoutCreate workoutType={workoutType}/>
                            {exerciseData
                            .filter((exercise)=>exercise.workout.workout_type === workoutType)
                            .map((exercise)=>(
                                <div key={exercise.id} className={`each-exercise ${workoutType}`}>
                                    
                                    <ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType} exerciseData={exercise}/>
                                    <ExerciseDelete exerciseId={exercise.id}/>
                                    <p>{exercise.workout.name}</p>
                                    
                                </div>
                            ))}

                            {defaultExerciseData
                            .filter((exercise)=>exercise.default_workout.workout_type === workoutType)
                            .map((exercise)=>(
                                <div key={exercise.id} className={`each-exercise ${workoutType}`}>
                                    
                                    <ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType} exerciseData={exercise}/>
                                    <ExerciseDelete exerciseId={exercise.id}/>
                                    <p>{exercise.default_workout.name}</p>
                                    
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
                                    
                                    <ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType_aerobic} exerciseData={exercise}/>
                                    <ExerciseDelete exerciseId={exercise.id}/>
                                    <p>{exercise.workout.name}</p>
                                    
                                </div>
                            ))}

                            {defaultExerciseData
                            .filter((exercise)=>exercise.default_workout.workout_type === workoutType_aerobic)
                            .map((exercise)=>(
                                <div key={exercise.id} className={`each-exercise ${workoutType_aerobic}`}>
                                    
                                    
                                    <ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType_aerobic} exerciseData={exercise}/>
                                    <ExerciseDelete exerciseId={exercise.id} />
                                    <p>{exercise.default_workout.name}</p>
                                    
                                </div>
                            ))}
                        </div>
                </div>

            </div>
        </div>
    );
};

export default ExerciseByDate;

import React, { useState, useEffect } from 'react';
import getCookie from '../../helpers/getCookie';
import { useParams } from 'react-router-dom';

import { BACKEND_ENDPOINT } from '../../settings';

import useAuthCheck from '../../helpers/useAuthCheck';
import ExerciseCreate from '../../components/exercise/ExerciseCreate';
import ExerciseDelete from '../../components/exercise/ExerciseDelete';
import ExerciseUpdate from '../../components/exercise/ExerciseUpdate';
import ExerciseNavigation from '../../components/exercise/exercise-nav/ExerciseNavigation';
import WorkoutCreate from '../../components/exercise/WorkoutCreate';
import LatestExerciseByType from '../../components/exercise/LatestExerciseByType';

import ExerciseLivingCreate from '../../components/exercise/ExerciseLivingCreate';
import ExerciseLivingUpdate from '../../components/exercise/ExerciseLivingUpdate';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../../redux/store/ToastSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';



const ExerciseByDate = () => {
    
    const { date } = useParams();
    const [exerciseData, setExerciseData] = useState([]);
    const workoutTypes = ['Chest', 'Back', 'Shoulder', 'Arm','Leg','Abs','Aerobic','Other'];

    const dispatch =useDispatch()
    const toastMes = useSelector((state) => state.toast.toastMes);
    const toastClass = useSelector((state) => state.toast.toastClass);
    const exerciseLoading = useSelector((state => state.loading.exerciseLoading))
    
    useAuthCheck()

    // clear toast Mess
    const clearToastMes = ()=>{
        dispatch(setToastMes(''))
    }

    // fetch data when load.
    useEffect(()=>{
        fetchExerciseData()
    },[exerciseLoading])

    // open collapse whne first render.
    useEffect(() => {
        document.querySelectorAll('.collapse').forEach((collapse) => {
            const inputCheckbox = collapse.querySelector('.peer');
            if (inputCheckbox) {
                inputCheckbox.checked = true; // 初期状態で開いた状態にする
            }
        });
    }, []);
    
    // fetch ExerciseData
    const fetchExerciseData = async () => {
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/exercise/get-exercise-date/?date=${date}`, {
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
            console.log('Success fetchExerciseData')

        } catch (error) {
            console.error('Error fetching exercise data:', error);
        } 
    };




    // render
    return (
        <div className='container'>
            <div className='sub-container'>
            <ExerciseNavigation/>
                <div className='mt-14 pt-80 max-sm:pt-96'>

                    {/* workout living */}
                    <div key='Living' className='flex flex-row'>
                            <div className=''>
                            
                            <LatestExerciseByType className="z-50" exercise_date={date} workout_type='Living'/>
                            </div>    

                            <div className="collapse border">
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-primary-content border pt-px pb-0">
                                    <label className="swap">    
                                    <input type="checkbox flex flex-row" />
                                        <h2 className="swap-off">
                                            <strong>{'Living'}</strong>
                                        </h2>
                                        <h2 className="swap-off ">
                                            <strong>{'Living'}</strong>
                                        </h2>
                                    </label>
                                </div>
                            
                                <div className="collapse-content text-primary-content">
                                    <div className="overflow-x-auto mt-1 pt-1">
                                    <ExerciseLivingCreate exercise_date={date}/>
                                    <table className="table table-xs table-pin-rows table-pin-cols">
                                        <tbody className='bg-gradient-to-r from-violet-600 to-sky-200 '>
                                            {exerciseData
                                                .filter((exercise)=>exercise.workout.workout_type === 'Living')
                                                .map((exercise)=>(
                                                    <tr key={exercise.id} className=''>
                                                        <td className='text-neutral-100'><strong>{`${exercise.workout.name}-${exercise.mets}Mets`}</strong></td>
                                                        <td><ExerciseLivingUpdate exerciseId={exercise.id} exerciseData={exercise} />
                                                        </td>
                                                        <td><ExerciseDelete exerciseId={exercise.id} /></td>
                                                    </tr>
                                                ))}
                                                
                                                {exerciseLoading&&(
                                                    <tr key='exercise-loading-Living' className="loading loading-bars loading-lg">
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* workout type */}
                    {workoutTypes.map((workoutType)=>(
                        <div key={workoutType} className='flex flex-row'>
                        
                            <div className=''>
                            <button className="btn btn-accent btn-xs border" onClick={() => document.getElementById(`my_modal_3_${workoutType}`).showModal()}>+</button>
                                <dialog id={`my_modal_3_${workoutType}`} className="modal">
                                    <div className="modal-box">
                                        <WorkoutCreate workoutType={workoutType} />
                                    </div>
                                    <form method="dialog" className="modal-backdrop" onClick={clearToastMes}>
                                        <button >✕</button>
                                    </form>

                                    {/* toast mes */}
                                    {toastMes && toastMes !=='' &&(
                                    <div className="toast">
                                        <div className={`alert ${toastClass}`}>
                                                <span>{toastMes}</span>
                                        </div>
                                    </div>)}

                                </dialog>
                            <LatestExerciseByType className="z-50" exercise_date={date} workout_type={workoutType} />
                            </div>    

                            <div className="collapse border">
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-primary-content border pt-px pb-0">
                                    <label className="swap">    
                                    <input type="checkbox flex flex-row" />
                                        <h2 className="swap-off">
                                            <strong>{workoutType}</strong>
                                        </h2>
                                        <h2 className="swap-off ">
                                            <strong>{workoutType}</strong>
                                        </h2>
                                    </label>
                                </div>
                            
                                <div className="collapse-content text-primary-content">
                                    <div className="overflow-x-auto mt-1 pt-1">
                                    <ExerciseCreate exercise_date={date} workoutType={workoutType} />
                                    <table className="table table-xs table-pin-rows table-pin-cols">
                                        <tbody className='bg-gradient-to-r from-orange-600 to-red-700 '>
                                            {exerciseData
                                                .filter((exercise)=>exercise.workout.workout_type === workoutType)
                                                .map((exercise)=>(
                                                    <tr key={exercise.id} className=''>
                                                        <td className='text-neutral-100'><strong>{exercise.workout.name}</strong></td>
                                                        <td><ExerciseUpdate exerciseId={exercise.id} workoutType={workoutType} exerciseData={exercise}/>
                                                        </td>
                                                        <td><ExerciseDelete exerciseId={exercise.id}/></td>
                                                    </tr>
                                                ))}
                                                {exerciseLoading&&(
                                                    <tr key={`exercise-loading-${workoutType}`} className="loading loading-bars loading-lg">
                                                    </tr>
                                                )}
                                                
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExerciseByDate;

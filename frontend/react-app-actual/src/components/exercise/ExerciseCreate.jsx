import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';
import WorkoutCreate from './WorkoutCreate';


const ExerciseCreate = ({workoutType,exercise_date,onUpdate}) => {
    const navigate=useNavigate()
    
    const [workouts,setWorkouts]= useState([])
    const [default_workouts,setDefaultWorkouts]= useState([])
    const [formData, setFormData] = useState({
        workout_id: '',
        exercise_date: exercise_date,

        is_default: null,
        sets: null,
        reps: null,
        weight_kg: null,

        duration_minutes: null,
        distance: null,
        mets: null,
        memos: null
    });

    const [workoutUpdateTrigger, setWorkoutUpdateTrigger] = useState(false);

    // fetch workouts and use in form.
    const fetchWorkouts = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/exercise/get-workout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setWorkouts(data.workout);
            setDefaultWorkouts(data.default_workout)
            onUpdate()
            
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };

    useAuthCheck(fetchWorkouts)

    // post exercise
    const handleCreateExercise = async (e) => {
        e.preventDefault()
        if((formData.sets === null || formData.reps === null) && formData.duration_minutes === null){
            window.alert('Please write sets,reps or mins.')
            return
        }
        
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/exercise/post-exercise/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken') ,
                },
                body: JSON.stringify(formData),
        });

        const data = await response.json();

        console.log('Exercise created successfully:', data);
        // 成功時の処理を追加
        onUpdate()

        } catch (error) {
            console.error('Error creating exercise:', error);
        ;
        } 
    };



    // detect change of form.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // If the value is an empty string, set it to null
        if(name === 'workout_id'){
            const isNumeric = /^\d+$/.test(value); // 数字かどうかチェック
            setFormData((prevData) => ({
                ...prevData,
                [name]: isNumeric ? Number(value) : value,
            }));
            

            const selectedWorkoutId = e.target.value;

            // 選択された workout を workouts リストから取得
            const selectedWorkout = workouts.find(
                (workout) => String(workout.id) === String(selectedWorkoutId)
            );

            // workout が見つかった場合、is_default は false
            if (selectedWorkout) {
                setFormData((prevFormData) => ({
                ...prevFormData,
                is_default: false,
                // その他のフォームデータも必要に応じて更新
                }));
            }
        
            // 選択された workout が見つからない場合、default_workouts リストから取得
            const selectedDefaultWorkout = default_workouts.find(
                (workout) => String(workout.id) === String(selectedWorkoutId)
            );
        
            // default_workout が見つかった場合、is_default は true
            if (selectedDefaultWorkout) {
                setFormData((prevFormData) => ({
                ...prevFormData,
                is_default: true,
                // その他のフォームデータも必要に応じて更新
                }));
            }

        }else{
            const sanitizedValue = value === '' ? null : value;
            if (name !== 'date') {
                setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
            }
        }
    };


    useEffect(()=>{
        fetchWorkouts()
    },[workoutUpdateTrigger])

    const handleUpdate = () => {
        // 何らかのアクションが発生した時にupdateTriggerをトグル
        setWorkoutUpdateTrigger((prev) => !prev);
        
    };


    
    return (
        <div>

            <form className='exercise-create-form  'onSubmit={handleCreateExercise}>
            <div className="join exercise-create">
                <select
                                name='workout_id'
                                value={formData.workout_id === null ? '' : formData.workout_id}
                                onChange={handleInputChange}
                                required
                                className='food-select select select-bordered join-item select-xs '
                            >
                                <option value='' disabled>workout</option>
                                {workouts
                                .filter((workout)=>workout.workout_type===workoutType)
                                .map((workout) => (
                                    <option key={workout.id} value={workout.id}>
                                    {workout.name}
                                </option>

                                    
                                ))}
                                {default_workouts
                                .filter((workout)=>workout.workout_type===workoutType)
                                .map((workout) => (
                                    <option key={workout.id} value={workout.id}>
                                        {workout.name}
                                    </option>
                                ))}
                            </select>
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary badge-xs">set</span> 
                    <input 
                        name='sets'
                        type="number"
                        value={formData.sets === null ? '' : formData.sets}
                        onChange={handleInputChange}
                        min={1}
                        className="food-select input select-bordered join-item input-xs" 
                    />
                </div>
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary badge-xs">rep</span> 
                    <input 
                        name='reps'
                        type="number"
                        value={formData.reps === null ? '' : formData.reps}
                        onChange={handleInputChange}
                        min={1}
                        className="food-select input select-bordered join-item input-xs" 
                    />
                </div>
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary badge-xs">kg</span> 
                    <input 
                        name='weight_kg'
                        type="number"
                        value={formData.weight_kg === null ? '' : formData.weight_kg}
                        onChange={handleInputChange}
                        min={0.1}
                        step={0.1}
                        className="food-select input select-bordered join-item input-xs" 
                    />
                </div>
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary badge-xs">met</span> 
                    <input 
                        name='mets'
                        type="number" 
                        value={formData.mets ===null?'':formData.mets} 
                        onChange={handleInputChange} 
                        required
                        min={1}
                        className="food-select input select-bordered join-item input-xs" 
                    />
                </div>


                {(workoutType !== 'Aerobic' && workoutType !== 'Other')? (
                        <></>
                    ) : (
                        <>
                        <div className="indicator">
                            <span className="indicator-item badge badge-secondary badge-xs">km</span> 
                            <input 
                                name='distance'
                                type="number"
                                value={formData.distance === null ? '' : formData.distance}
                                onChange={handleInputChange}
                                min={0.1}
                                step={0.1}
                                className="food-select input select-bordered join-item input-xs" 
                            />
                        </div>
                        <div className="indicator">
                            <span className="indicator-item badge badge-secondary badge-xs">min</span> 
                            <input 
                                name="duration_minutes"
                                type="number"
                                value={formData.duration_minutes === null ? '' : formData.duration_minutes}
                                onChange={handleInputChange}
                                min={1}
                                className="food-select input select-bordered join-item input-xs" 
                            />
                        </div>
                        </>
                    )}
                
                    <button className='btn btn-xs btn-accent' type='submit'>Add</button>
                </div>
                <div className='exercise-create-others'>
                        <textarea 
                            name='memos'
                            value={formData.memos ===null?'':formData.memos} 
                            onChange={handleInputChange} 
                            placeholder='Memos'
                            className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                        />
                    
                </div>
            </form>
            <button className="btn btn-primary btn-xs" onClick={() => document.getElementById(`my_modal_3_${workoutType}`).showModal()}>workout</button>
                    <dialog id={`my_modal_3_${workoutType}`} className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                            <button className="btn btn-circle btn-ghost absolute right-2 top-2 btn-sm">✕</button>
                            </form>
                            <WorkoutCreate workoutType={workoutType} />
                        </div>
                    </dialog>
        </div>
    );
};

export default ExerciseCreate;

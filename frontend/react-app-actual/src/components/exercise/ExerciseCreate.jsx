import React, { useState, useEffect } from 'react';
import getCookie from '../../helpers/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { setExerciseLoading } from '../../redux/store/LoadingSlice';

const ExerciseCreate = ({workoutType,exercise_date}) => {

    const dispatch =useDispatch()
    const workoutLoading = useSelector((state)=> state.loading.workoutLoading)
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

    // fetch when load.
    useEffect(() => {
        fetchWorkouts();
    }, [workoutLoading]);

    // fetch workouts and use in form.
    const fetchWorkouts = async () => {
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/exercise/get-workout/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();

            if(response.ok){
                setWorkouts(data.workout);
                setDefaultWorkouts(data.default_workout)
                console.log('Success fetchWorkouts!');
            }else{
                console.log("Error!")
            }
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };

    
    // post exercise
    const handleCreateExercise = async (e) => {
        e.preventDefault()
        if((formData.sets === null || formData.reps === null) && formData.duration_minutes === null){
            window.alert('Please write sets,reps or mins.')
            return
        }
        
        try {
            dispatch(setExerciseLoading(true))
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/exercise/post-exercise/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken') ,
                },
                body: JSON.stringify(formData),
        });

        const data = await response.json();
        if(response.ok){
            console.log('Exercise created successfully:', data);
        // 成功時の処理を追加
        }else{
            console.log('Error!')
        }
        
        } catch (error) {
            console.error('Error creating exercise:', error);
        ;
        }finally{
            dispatch(setExerciseLoading(false))
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

    

    // render
    return (
        <div>
            <form className='border'onSubmit={handleCreateExercise}>
            <div className="">
                <div className='flex'>
                    <select
                        name='workout_id'
                        value={formData.workout_id === null ? '' : formData.workout_id}
                        onChange={handleInputChange}
                        required
                        className=' select select-bordered join-item select-xs '
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
                    <div className='indicator'>
                        <button className='btn btn-xs btn-accent' type='submit'>Add</button>
                    </div>
                </div>
                
                <div className='flex max-sm:flex-col max-sm:items-center'>
                    <div className='sets-reps flex '>
                        <div className="flex pr-1 mr-0">
                            <span className=" indicator-item badge badge-secondary badge-xs">set</span> 
                            <input 
                                name='sets'
                                type="number"
                                value={formData.sets === null ? '' : formData.sets}
                                onChange={handleInputChange}
                                min={1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-secondary badge-xs">rep</span> 
                            <input 
                                name='reps'
                                type="number"
                                value={formData.reps === null ? '' : formData.reps}
                                onChange={handleInputChange}
                                min={1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                    </div>
                    
                    <div className='kg-mets flex '>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-secondary badge-xs">kg</span> 
                            <input 
                                name='weight_kg'
                                type="number"
                                value={formData.weight_kg === null ? '' : formData.weight_kg}
                                onChange={handleInputChange}
                                min={0.1}
                                step={0.1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-secondary badge-xs">met</span> 
                            <select
                                name="mets"
                                value={formData.mets === null ? '' : formData.mets}
                                onChange={handleInputChange}
                                required
                                className="w-full input select-bordered join-item input-xs"
                            >
                                <option value="1">1 (Sitting)</option>
                                <option value="1.5">1.5 (Standing)</option>
                                <option value="2">2 (light trainnig)</option>
                                <option value="2.5">2.5 (Walk)</option>
                                <option value="3">3 (light trainning)</option>
                                <option value="3.5">3.5 (middle trainning)</option>
                                <option value="4">4 ()</option>
                                <option value="4.5">4.5 ()</option>
                                <option value="5">5 ()</option>
                                <option value="5.5">5.5 ()</option>
                                <option value="6">6 (hard trainning)</option>
                                <option value="6.5">6.5</option>
                                <option value="7">7 (Light Jog)</option>
                                <option value="7.5">7.5 (Climb)</option>
                                <option value="8">8</option>
                                <option value="8.5">8.5</option>
                                <option value="9">9</option>
                                <option value="9.5">9.5</option>
                                <option value="10">10 (Bike,Swim)</option>
                                <option value="10.5">10.5 </option>
                                <option value="11">11 (Hard Squat)</option>
                                <option value="11.5">11.5 ()</option>
                                <option value="12">12 (High Speed Run)</option>
                            </select>
                        </div>
                    </div>

                    {(workoutType !== 'Aerobic' && workoutType !== 'Other')? (
                            <></>
                        ) : (
                            <div className='km-mins flex'>
                            <div className="flex pr-1">
                                <span className="indicator-item badge badge-secondary badge-xs">km</span> 
                                <input 
                                    name='distance'
                                    type="number"
                                    value={formData.distance === null ? '' : formData.distance}
                                    onChange={handleInputChange}
                                    min={0.1}
                                    step={0.1}
                                    className="w-full input select-bordered join-item input-xs" 
                                />
                            </div>
                            <div className="flex pr-1">
                                <span className="indicator-item badge badge-secondary badge-xs">min</span> 
                                <input 
                                    name="duration_minutes"
                                    type="number"
                                    value={formData.duration_minutes === null ? '' : formData.duration_minutes}
                                    onChange={handleInputChange}
                                    min={1}
                                    className="w-full input select-bordered join-item input-xs" 
                                />
                            </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ExerciseCreate;

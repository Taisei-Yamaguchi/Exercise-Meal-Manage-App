import React, { useState, useEffect } from 'react';
import getCookie from '../../helpers/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setExerciseLoading} from '../../redux/store/LoadingSlice';


const ExerciseLivingCreate = ({exercise_date}) => {

    const dispatch =useDispatch()
    const [formData, setFormData] = useState({
        workout_id: 'living',
        exercise_date: exercise_date,
        is_default: true,
        duration_minutes: null,
        mets: null,
        
    });

    // post exercise
    const handleCreateExercise = async (e) => {
        e.preventDefault()
        
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
        }else{
            console.log("Error!")
        }
        } catch (error) {
            console.error('Error creating exercise:', error);
        } finally{
            dispatch(setExerciseLoading(false))
        }
    };

    // detect change of form.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // If the value is an empty string, set it to null
        const sanitizedValue = value === '' ? null : value;
        if (name !== 'date') {
            setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
        }
    };


    // render
    return (
        <div>
            <form className='border'onSubmit={handleCreateExercise}>
                <div className='flex flex-col-row items-center'>    
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
                                <option value="2">2 (Cooking,Stretch)</option>
                                <option value="2.5">2.5 (Walk)</option>
                                <option value="3">3 (Cleaning)</option>
                                <option value="3.5">3.5 (Climb stair)</option>
                                <option value="4">4 (Playing the instrument)</option>
                                <option value="4.5">4.5 (Walk fast)</option>
                                <option value="5">5</option>
                                <option value="5.5">5.5 (Carrying furniture)</option>
                                <option value="6">6</option>
                                <option value="6.5">6.5</option>
                                <option value="7">7 (Light Jog)</option>
                                <option value="7.5">7.5 (Climb)</option>
                                <option value="8">8</option>
                                
                            </select>
                        
                    </div>
                            
                    <div className="flex pr-1">
                        <span className="indicator-item badge badge-secondary badge-xs">min</span> 
                        <input 
                            name="duration_minutes"
                            type="number"
                            value={formData.duration_minutes === null ? '' : formData.duration_minutes}
                            onChange={handleInputChange}
                            min={1}
                            required
                            className="w-full input select-bordered join-item input-xs" 
                        />
                    </div>

                    <div className='indicator'>
                        <button className='btn btn-xs btn-accent' type='submit'>Add</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ExerciseLivingCreate;

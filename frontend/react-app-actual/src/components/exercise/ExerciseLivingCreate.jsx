import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';



const ExerciseLivingCreate = ({exercise_date,onUpdate}) => {
    
    const [formData, setFormData] = useState({
        workout_id: 'living',
        exercise_date: exercise_date,
        is_default: true,
        duration_minutes: null,
        mets: null,
        
    });

    // // fetch workouts and use in form.
    // useAuthCheck()

    // post exercise
    const handleCreateExercise = async (e) => {
        e.preventDefault()
        
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
        const sanitizedValue = value === '' ? null : value;
        if (name !== 'date') {
            setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
        }
    };
    
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
                                <option value="2">2 (洗濯、料理、ストレッチ)</option>
                                <option value="2.5">2.5 (Walk)</option>
                                <option value="3">3 (掃除、荷造り)</option>
                                <option value="3.5">3.5 (昇降運動)</option>
                                <option value="4">4 (ドラム)</option>
                                <option value="4.5">4.5 (早歩き、農耕)</option>
                                <option value="5">5</option>
                                <option value="5.5">5.5 (家具運搬)</option>
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

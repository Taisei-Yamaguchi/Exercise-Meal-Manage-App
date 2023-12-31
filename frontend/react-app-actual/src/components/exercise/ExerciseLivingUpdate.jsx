import React, { useState, useEffect } from 'react';
import getCookie from '../../helpers/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setExerciseLoading } from '../../redux/store/LoadingSlice';


const ExerciseLivingUpdate = ({ exerciseId, exerciseData}) => {
    const dispatch = useDispatch()
    const [updateData, setUpdateData] = useState({
        duration_minutes: exerciseData.duration_minutes,
        mets: exerciseData.mets,
    });
    
    // detect input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value === '' ? null : value;
        setUpdateData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };

    // submit data func
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        dispatch(setExerciseLoading(true))
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/exercise/exercise/update/${exerciseId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            console.log('send data to server.')
        } else {
            console.error('Failed to update exercise');
        }
        } catch (error) {
            console.error('Failed to update exercise', error);
        } finally{
            dispatch(setExerciseLoading(false))
        }
    };


    // render
    return (
        <form onSubmit={handleSubmit} className=''>
            <div className='flex max-sm:items-center'>
                
                <div className="flex pr-1">
                    <span className="indicator-item badge badge-accent badge-xs">min</span> 
                    <input 
                        name="duration_minutes"
                        type="number"
                        value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                        onChange={handleInputChange}
                        min={1}
                        required
                        className="w-full input select-bordered join-item input-xs" 
                    />
                </div>
                <div className=''>
                    <button type='submit' className='exercise-update-btn btn btn-xs btn-warning'>
                        save
                    </button>
                </div>

            </div>
        </form>
    );
};

export default ExerciseLivingUpdate;

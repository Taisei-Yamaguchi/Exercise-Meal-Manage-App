import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';

const ExerciseLivingUpdate = ({ exerciseId, exerciseData,onUpdate}) => {
    const [updateData, setUpdateData] = useState({
        duration_minutes: exerciseData.duration_minutes,
        mets: exerciseData.mets,
    });
    
    useAuthCheck()
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value === '' ? null : value;
        setUpdateData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://127.0.0.1:8000/exercise/exercise/update/${exerciseId}/`, {
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
            onUpdate()
        } else {
            console.error('Failed to update exercise');
        }
        } catch (error) {
        console.error('Failed to update exercise', error);
        }
    };

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

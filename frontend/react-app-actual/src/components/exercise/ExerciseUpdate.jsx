import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';

const ExerciseUpdate = ({ exerciseId, workoutType, exerciseData,onUpdate}) => {
    const [updateData, setUpdateData] = useState({

        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight_kg: exerciseData.weight_kg,

        duration_minutes: exerciseData.duration_minutes,
        distance: exerciseData.distance,
        mets: exerciseData.mets,
        memos: exerciseData.memos
    });
    console.log(exerciseId,workoutType,exerciseData)
    
    
    useAuthCheck()
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name,value)
        const sanitizedValue = value === '' ? null : value;
        setUpdateData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if((updateData.sets === null || updateData.reps === null) && updateData.duration_minutes === null){
            window.alert('Please write sets,reps or mins.')
            return
        }

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
        <form onSubmit={handleSubmit}>
            <div className='exercise-update-form'>
                <div className='exercise-update-detail'>
                    <label className='sets'>
                        <input
                            name='sets'
                            type="number"
                            value={updateData.sets === null ? '' : updateData.sets}
                            onChange={handleInputChange}
                            min={1}
                        />(sets)
                    </label>

                    <label className='reps'>
                        <input
                            name='reps'
                            type="number"
                            value={updateData.reps === null ? '' : updateData.reps}
                            onChange={handleInputChange}
                            min={1}
                        />(reps)
                    </label>

                    <label className='weight_kg'>
                        <input
                            name='weight_kg'
                            type="number"
                            value={updateData.weight_kg === null ? '' : updateData.weight_kg}
                            onChange={handleInputChange}
                            min={0.1}
                            step={0.1}
                        />(kg)
                    </label>
            
                    {workoutType !== 'Aerobic' && workoutType !== 'Other'? (
                        <>
                        </>
                    ) : (
                        <>
                            <label className='distance'>
                                <input
                                    name='distance'
                                    type="number"
                                    value={updateData.distance === null ? '' : updateData.distance}
                                    onChange={handleInputChange}
                                    min={0.1}
                                    step={0.1}
                                />(km)
                            </label>

                            <label className='duration_minutes'>
                                <input
                                    name="duration_minutes"
                                    type="number"
                                    value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                                    onChange={handleInputChange}
                                    min={1}
                                />(mins)
                            </label>
                        </>
                    )}

                    <label className='mets'>
                        <input 
                            name='mets'
                            type="number" 
                            value={updateData.mets ===null?'':updateData.mets} 
                            onChange={handleInputChange} 
                            required
                            min={0.1}
                            step={0.1}
                        />(mets)
                    </label>
                </div>

                <div className='exercise-update-others'>
                    <label>
                        
                        <textarea 
                        name='memos'
                        value={updateData.memos ===null?'':updateData.memos} 
                        onChange={handleInputChange}
                        placeholder='memos'
                        />
                        
                    </label>

                    <button type='submit' className='exercise-update-btn'>
                        U
                    </button>
                </div>

            </div>
        </form>
    );
};

export default ExerciseUpdate;

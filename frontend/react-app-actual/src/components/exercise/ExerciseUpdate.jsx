import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';

const ExerciseUpdate = ({ exerciseId, workoutType, exerciseData}) => {
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
    
    

    // useEffect(() => {
        
    //     setExerciseData((prevData) => ({
    //     ...prevData,
    //     // ここでworkoutTypeに基づいた初期値の設定を行う
    //     }));
    // }, []);

    // detect change of form.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name,value)
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
            
                    {workoutType === 'Aerobic' ? (
                        <>
                            <label>
                                <input
                                    name='distance'
                                    type="number"
                                    value={updateData.distance === null ? '' : updateData.distance}
                                    onChange={handleInputChange}
                                />(km)
                            </label>

                            <label>
                                
                                <input
                                    name="duration_minutes"
                                    type="number"
                                    value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                                    onChange={handleInputChange}
                                />(mins)
                            </label>
                        </>
                    ) : (
                        <>
                            <label>
                                
                                <input
                                    name='sets'
                                    type="number"
                                    value={updateData.sets === null ? '' : updateData.sets}
                                    onChange={handleInputChange}
                                />(sets)
                            </label>

                            <label>
                                
                                <input
                                    name='reps'
                                    type="number"
                                    value={updateData.reps === null ? '' : updateData.reps}
                                    onChange={handleInputChange}
                                />(reps)
                            </label>

                            <label>
                                
                                <input
                                    name='weight_kg'
                                    type="number"
                                    value={updateData.weight_kg === null ? '' : updateData.weight_kg}
                                    onChange={handleInputChange}
                                />(kg)
                            </label>
                        </>
                    )}

                        

                        <label>
                            
                            <input 
                            name='mets'
                            type="number" 
                            value={updateData.mets ===null?'':updateData.mets} 
                            onChange={handleInputChange} />
                            (mets)
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

                    <button onClick={handleSubmit} >
                        U
                    </button>
                </div>

            </div>
        </form>
    );
};

export default ExerciseUpdate;

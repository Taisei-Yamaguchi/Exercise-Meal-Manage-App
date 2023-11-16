import React, { useState, useEffect } from 'react';
import getCookie from '../helpers/getCookie';

const ExerciseUpdateForm = ({ exerciseId, workoutType, exerciseData}) => {
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
            
        {workoutType === 'Aerobic' ? (
            <>
                <label>
                    Distance:
                    <input
                        name='distance'
                        type="number"
                        value={updateData.distance === null ? '' : updateData.distance}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Duration (minutes):
                    <input
                        name="duration_minutes"
                        type="number"
                        value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                        onChange={handleInputChange}
                    />
                </label>
            </>
        ) : (
            <>
                <label>
                    Sets:
                    <input
                        name='sets'
                        type="number"
                        value={updateData.sets === null ? '' : updateData.sets}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Reps:
                    <input
                        name='reps'
                        type="number"
                        value={updateData.reps === null ? '' : updateData.reps}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Weight (kg):
                    <input
                        name='weight_kg'
                        type="number"
                        value={updateData.weight_kg === null ? '' : updateData.weight_kg}
                        onChange={handleInputChange}
                    />
                </label>
            </>
        )}

            

            <label>
                METs:
                <input 
                name='mets'
                type="number" 
                value={updateData.mets ===null?'':updateData.mets} 
                onChange={handleInputChange} />
            </label>

            <label>
                Memos:
                <textarea 
                name='memos'
                value={updateData.memos ===null?'':updateData.memos} 
                onChange={handleInputChange} />
            </label>

            <button onClick={handleSubmit} >
                UPDATE
            </button>
        
        </form>
    );
};

export default ExerciseUpdateForm;

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
    
    useAuthCheck()
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
        <form onSubmit={handleSubmit} className='update-container'>
            <ul className=" bg-base-200 rounded-box exercise-detail-update">
                <li className='exercise-info'>
                    <label className='sets'>
                        <input
                            name='sets'
                            type="number"
                            value={updateData.sets === null ? '' : updateData.sets}
                            onChange={handleInputChange}
                            min={1}
                            className="input-number input input-bordered input-xs"
                        />(sets)
                    </label>
                </li>
                <li className='exercise-info'>
                    <label className='reps'>
                            <input
                                name='reps'
                                type="number"
                                value={updateData.reps === null ? '' : updateData.reps}
                                onChange={handleInputChange}
                                min={1}
                                className="input-number input input-bordered input-xs"
                            />(reps)
                    </label>
                </li>
                <li className='exercise-info'>
                    <label className='kg'>
                            <input
                                name='weight_kg'
                                type="number"
                                value={updateData.weight_kg === null ? '' : updateData.weight_kg}
                                onChange={handleInputChange}
                                min={1}
                                className="input-number input input-bordered input-xs max-w-xs"
                            />(kg)
                    </label>
                </li>
                
                
                    {workoutType !== 'Aerobic' && workoutType !== 'Other'? (
                        <><li className='exercise-info'></li>
                        
                        </>
                    ) : (
                        <>
                        <li className='exercise-info'>
                            <label className='distance'>
                                <input
                                    name='distance'
                                    type="number"
                                    value={updateData.distance === null ? '' : updateData.distance}
                                    onChange={handleInputChange}
                                    min={0.1}
                                    step={0.1}
                                    className=" input-number input input-bordered input-xs max-w-xs"
                                />(km)
                            </label>
                        </li>
                        <li className='exercise-info'>
                            <label className='duration_minutes'>
                                <input
                                    name="duration_minutes"
                                    type="number"
                                    value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                                    onChange={handleInputChange}
                                    min={1}
                                    className="input-number input input-bordered input-xs max-w-xs"
                                />(mins)
                                
                            </label>
                        </li>
                        </>
                    )}


                    <li className='exercise-info'>
                    <label className='mets'>
                    <select
                        name="mets"
                        value={updateData.mets === null ? '' : updateData.mets}
                        onChange={handleInputChange}
                        required
                        className="input-number input input-xs max-w-xs"
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
                        <option value="8.5">8.5</option>
                        <option value="9">9</option>
                        <option value="9.5">9.5</option>
                        <option value="10">10 (Bike,Swim)</option>
                        <option value="10.5">10.5 </option>
                        <option value="11">11 (Squat)</option>
                        <option value="11.5">11.5 ()</option>
                        <option value="12">12 (High Speed Run)</option>
                    </select>
                        (mets)
                    </label>
                    </li>
            </ul>
            
            <div className='exercise-update-others'>
                    <label>
                        <textarea 
                        name='memos'
                        value={updateData.memos ===null?'':updateData.memos} 
                        onChange={handleInputChange}
                        placeholder='memos'
                        className=" textarea textarea-bordered textarea-xs  max-w-xs textarea-width"
                        />
                    </label>
                    <button type='submit' className='exercise-update-btn btn btn-xs btn-accent'>
                        Update
                    </button>
            </div>
        </form>
    );
};

export default ExerciseUpdate;

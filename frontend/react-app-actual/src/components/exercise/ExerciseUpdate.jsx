import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setExerciseLoading } from '../../redux/store/LoadingSlice';

const ExerciseUpdate = ({ exerciseId, workoutType, exerciseData}) => {

    const dispatch = useDispatch()
    const [updateData, setUpdateData] = useState({
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight_kg: exerciseData.weight_kg,
        duration_minutes: exerciseData.duration_minutes,
        distance: exerciseData.distance,
        mets: exerciseData.mets,
        memos: exerciseData.memos
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
        if((updateData.sets === null || updateData.reps === null) && updateData.duration_minutes === null){
            window.alert('Please write sets,reps or mins.')
            return
        }

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
        <form onSubmit={handleSubmit} className='border'>
                <div className='flex max-sm:flex-col max-sm:items-center'>
                    <div className='max-sm:hidden'>
                        <button type='submit' className='exercise-update-btn btn btn-xs btn-warning'>
                            save
                        </button>
                    </div>
                    <div className='sets-reps flex max-sm:flex-col'>
                        <div className="flex pr-1 mr-0">
                            <span className=" indicator-item badge badge-accent badge-xs">set</span> 
                            <input 
                                name='sets'
                                type="number"
                                value={updateData.sets === null ? '' : updateData.sets}
                                onChange={handleInputChange}
                                min={1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-accent badge-xs">rep</span> 
                            <input 
                                name='reps'
                                type="number"
                                value={updateData.reps === null ? '' : updateData.reps}
                                onChange={handleInputChange}
                                min={1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                    </div>
                    
                    <div className='kg-mets flex max-sm:flex-col'>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-accent badge-xs">{`${'\u00A0'}kg${'\u00A0'}`}</span> 
                            <input 
                                name='weight_kg'
                                type="number"
                                value={updateData.weight_kg === null ? '' : updateData.weight_kg}
                                onChange={handleInputChange}
                                min={0.1}
                                step={0.1}
                                className="w-full input select-bordered join-item input-xs" 
                            />
                        </div>
                        <div className="flex  pr-1">
                            <span className="indicator-item badge badge-accent badge-xs">met</span> 
                            <select
                                name="mets"
                                value={updateData.mets === null ? '' : updateData.mets}
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
                                <option value="8.5">8.5</option>
                                <option value="9">9</option>
                                <option value="9.5">9.5</option>
                                <option value="10">10 (Bike,Swim)</option>
                                <option value="10.5">10.5 </option>
                                <option value="11">11 (Squat)</option>
                                <option value="11.5">11.5 ()</option>
                                <option value="12">12 (High Speed Run)</option>
                            </select>
                        </div>
                    </div>

                    {(workoutType !== 'Aerobic' && workoutType !== 'Other')? (
                            <></>
                        ) : (
                        <div className='km-mins flex max-sm:flex-col'>
                            <div className="flex pr-1">
                                <span className="indicator-item badge badge-accent badge-xs">{`${'\u00A0'}km${'\u00A0'}`}</span> 
                                <input 
                                    name='distance'
                                    type="number"
                                    value={updateData.distance === null ? '' : updateData.distance}
                                    onChange={handleInputChange}
                                    min={0.1}
                                    step={0.1}
                                    className="w-full input select-bordered join-item input-xs" 
                                />
                            </div>
                            <div className="flex pr-1">
                                <span className="indicator-item badge badge-accent badge-xs">min</span> 
                                <input 
                                    name="duration_minutes"
                                    type="number"
                                    value={updateData.duration_minutes === null ? '' : updateData.duration_minutes}
                                    onChange={handleInputChange}
                                    min={1}
                                    className="w-full input select-bordered join-item input-xs" 
                                />
                            </div>
                        </div>
                        )}
                    </div>

                    <div className='flex items-end mt-1'>
                        <textarea 
                        name='memos'
                        value={updateData.memos ===null?'':updateData.memos} 
                        onChange={handleInputChange}
                        placeholder='memos'
                        className="w-full textarea textarea-bordered textarea-xs  textarea-width"
                        />
                        <div className='sm:hidden '>
                            <button type='submit' className='exercise-update-btn btn btn-xs btn-warning'>
                                save
                            </button>
                        </div>
                    </div>
        </form>
    );
};

export default ExerciseUpdate;

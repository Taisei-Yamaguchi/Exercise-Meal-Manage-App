import React, { useState, useEffect } from 'react';
import getCookie from '../hooks/getCookie';
import useAuthCheck from '../hooks/useAuthCheck';
import GoalNavigation from '../components/goal/GoalNavigation';
import { BACKEND_ENDPOINT } from '../settings';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../redux/store/ToastSlice';
import { setToastClass } from '../redux/store/ToastSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';


const Goal = () => {
    const toastMes = useSelector((state)=>state.toast.toastMes)
    const toastClass = useSelector((state)=>state.toast.toastClass)
    const dispatch =useDispatch()
    const [formData, setFormData] = useState({
        goal_intake_cals: null,
        goal_consuming_cals: null,
        goal_weight: null,
        goal_body_fat: null,
        goal_muscle_mass: null,
        weekly_goal_chest: null,
        weekly_goal_leg: null,
        weekly_goal_shoulder: null,
        weekly_goal_arm: null,
        weekly_goal_back: null,
        weekly_goal_abs: null,
    });

    useAuthCheck()

    // fetch Goal first Render
    useEffect(()=>{
        fetchGoal()
    },[])

    // Fetch the goal when the component mounts
    const fetchGoal = async () => {
        try {
            dispatch(setToastMes(''))
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/goal/get/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });

            const data = await response.json();

            if ('message' in data) {
                console.log(data.message)
            }else{
                setFormData({
                    ...formData,
                    goal_intake_cals: data.goal_intake_cals || null,
                    goal_consuming_cals: data.goal_consuming_cals || null,
                    goal_weight: data.goal_weight || null,
                    goal_body_fat: data.goal_body_fat || null,
                    goal_muscle_mass: data.goal_muscle_mass || null,
                    weekly_goal_chest: data.weekly_goal_chest || null,
                    weekly_goal_leg: data.weekly_goal_leg || null,
                    weekly_goal_shoulder: data.weekly_goal_shoulder || null,
                    weekly_goal_arm: data.weekly_goal_arm || null,
                    weekly_goal_back: data.weekly_goal_back || null,
                    weekly_goal_abs: data.weekly_goal_abs || null,
                });
                console.log('Success fetchGoal!')
            }
            
        } catch (error) {
            console.error('Error fetching latest user info:', error);
        }
    };
    

    // detect input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // If the value is an empty string, set it to null
        const sanitizedValue = value === '' ? null : value;
        setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
    };


    // send data and save goal
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/goal/create-update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if(response.ok){
            console.log('User Goal saved successfully:', data);
            fetchGoal()
            dispatch(setToastMes('Update Success!'))
            dispatch(setToastClass('alert-info'))
        }else{
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
            console.log("Error!")
        }
        } catch (error) {
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
            console.error('Error saving user info:', error);
        }
    };


    // render
    return (
        <div className='container'>
            <div className='sub-container '>
                <GoalNavigation />
                <div className='main'>
                <h2>Goal Form</h2>
                
                <form onSubmit={handleSubmit} className='user-info-form'>
                    {/* Render form fields with their corresponding values */}
                        <label>
                            <strong>Goal intake cals (cals/day)</strong>
                            <input
                                type="number"
                                name="goal_intake_cals"
                                value={formData.goal_intake_cals === null ? '' : formData.goal_intake_cals}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Goal consuming cals (cals/day)</strong>
                            <input
                                type="number"
                                name="goal_consuming_cals"
                                value={formData.goal_consuming_cals === null ? '' : formData.goal_consuming_cals}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Goal weight (kg)</strong>
                            <input
                                type="number"
                                name="goal_weight"
                                value={formData.goal_weight === null ? '' : formData.goal_weight}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Goal body fat (%)</strong>
                            <input
                                type="number"
                                name="goal_body_fat"
                                value={formData.goal_body_fat === null ? '' : formData.goal_body_fat}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Goal muscle mass (kg)</strong>
                            <input
                                type="number"
                                name="goal_muscle_mass"
                                value={formData.goal_muscle_mass === null ? '' : formData.goal_muscle_mass}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal chest (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_chest"
                                value={formData.weekly_goal_chest === null ? '' : formData.weekly_goal_chest}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal leg (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_leg"
                                value={formData.weekly_goal_leg === null ? '' : formData.weekly_goal_leg}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal shoulder (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_shoulder"
                                value={formData.weekly_goal_shoulder === null ? '' : formData.weekly_goal_shoulder}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal arm (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_arm"
                                value={formData.weekly_goal_arm === null ? '' : formData.weekly_goal_arm}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal back (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_back"
                                value={formData.weekly_goal_back === null ? '' : formData.weekly_goal_back}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>

                        <label>
                            <strong>Weekly goal abs (kg)</strong>
                            <input
                                type="number"
                                name="weekly_goal_abs"
                                value={formData.weekly_goal_abs === null ? '' : formData.weekly_goal_abs}
                                onChange={handleInputChange}
                                min={1}
                                step={0.1}
                                className="input input-bordered input-primary w-full max-w-xs"
                            />
                        </label>
                        {toastMes && toastMes !==''&&(
                            <div role="alert" className={`alert ${toastClass}`} >
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{toastMes}</span>
                            </div>
                        )}
                    <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-secondary">Save</button>
                </form>
                </div>
            </div>
        </div>
    );
};

export default Goal;

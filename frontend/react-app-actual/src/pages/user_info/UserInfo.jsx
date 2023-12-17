import React, { useState, useEffect } from 'react';
import getCookie from '../../helpers/getCookie';
import useAuthCheck from '../../helpers/useAuthCheck';
import UserInfoNavigation from '../../components/user_info/user_info-nav/UserInfoNavigation';
import formattedCurrentDate from '../../helpers/getToday';
import { BACKEND_ENDPOINT } from '../../settings';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../../redux/store/ToastSlice';
import { setToastClass } from '../../redux/store/ToastSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';


const UserInfo = () => {
    const toastMes = useSelector((state)=>state.toast.toastMes)
    const toastClass = useSelector((state)=>state.toast.toastClass)
    const dispatch =useDispatch()
    const [formData, setFormData] = useState({
        date: formattedCurrentDate, // set the current date as default
        weight: null,
        height: null,
        body_fat_percentage: null,
        muscle_mass: null,
        metabolism: null,
        // target_weight: null,
        // target_body_fat_percentage: null,
        // target_muscle_mass: null,
    });

    useAuthCheck()

    // fetch data first render.
    useEffect(()=>{
        fetchLatestInfo()
    },[])


    // Fetch the latest user info when the component mounts
    const fetchLatestInfo = async () => {
        try {
            dispatch(setToastMes(''))
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/user_info/get-latest/`,{
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
                // Set the form data with the latest info
                setFormData({
                    ...formData,
                    weight: data.weight,
                    height: data.height,
                    body_fat_percentage: data.body_fat_percentage,
                    muscle_mass: data.muscle_mass,
                    metabolism: data.metabolism,
                    // target_weight: data.target_weight,
                    // target_body_fat_percentage: data.target_body_fat_percentage,
                    // target_muscle_mass: data.target_muscle_mass,
                });
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
        if (name !== 'date') {
            setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
        }
    };


    // send data and save user info.
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/user_info/create-update/`, {
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
            fetchLatestInfo()
            console.log('User info saved successfully:', data);

            dispatch(setToastMes('Update Success!'))
            dispatch(setToastClass('alert-info'))
        }else{
            dispatch(setToastMes('Error!'))
            dispatch(setToastClass('alert-error'))
            console.log('Error!');
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
                <UserInfoNavigation />
                <div className='main'>
                
                <form onSubmit={handleSubmit} className='user-info-form'>
                    {/* Render form fields with their corresponding values */}
                    <label>
                        <strong>Weight (kg) (必須)</strong>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight ===null?'':formData.weight}
                            onChange={handleInputChange}
                            required
                            min={1}
                            step={0.1}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </label>

                    <label>
                        <strong>Tall (cm) (必須)</strong>
                        <input
                            type="number"
                            name="height"
                            value={formData.height ===null?'': formData.height}
                            onChange={handleInputChange}
                            required
                            min={1}
                            step={0.1}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </label>

                    <label>Body Fat Rate (%)<input
                        type="number"
                        name="body_fat_percentage"
                        value={formData.body_fat_percentage ===null?'': formData.body_fat_percentage}
                        onChange={handleInputChange}
                        min={1}
                        step={0.1}
                        className="input input-bordered input-primary w-full max-w-xs"
                    /></label>

                    <label>Muscle Mass (kg) <input
                        type="number"
                        name="muscle_mass"
                        value={formData.muscle_mass ===null?'': formData.muscle_mass}
                        onChange={handleInputChange}
                        min={1}
                        step={0.1}
                        className="input input-bordered input-primary w-full max-w-xs"
                    /></label>

                    <label>Basic Metabolism (kcal)<input
                        type="number"
                        name="metabolism"
                        value={formData.metabolism ===null?'': formData.metabolism}
                        onChange={handleInputChange}
                        min={1}
                        step={0.1}
                        className="input input-bordered input-primary w-full max-w-xs"
                    /></label>

                    
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

export default UserInfo;

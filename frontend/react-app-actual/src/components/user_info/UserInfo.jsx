import React, { useState, useEffect } from 'react';
import getCookie from '../../hooks/getCookie';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import UserInfoNavigation from './user_info-nav/UserInfoNavigation';


const UserInfo = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    const [formData, setFormData] = useState({
        date: formattedDate, // set the current date as default
        weight: null,
        height: null,
        body_fat_percentage: null,
        muscle_mass: null,
        metabolism: null,
        target_weight: null,
        target_body_fat_percentage: null,
        target_muscle_mass: null,
    });



    // Fetch the latest user info when the component mounts
    const fetchLatestInfo = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/user_info/get-latest/',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });

            const data = await response.json();

            if ('message' in data) {
                console.log(data.message)
            }else{
                // Set the form data with the latest info
                // ここにデータが存在しない場合、つまり、これまでユーザーが一度もuser_infoを入力していない場合、formDataは更新したくない
                setFormData({
                    ...formData,
                    weight: data.weight,
                    height: data.height,
                    body_fat_percentage: data.body_fat_percentage,
                    muscle_mass: data.muscle_mass,
                    metabolism: data.metabolism,
                    target_weight: data.target_weight,
                    target_body_fat_percentage: data.target_body_fat_percentage,
                    target_muscle_mass: data.target_muscle_mass,
                });
            }
            
        } catch (error) {
            console.error('Error fetching latest user info:', error);
        }
    };



    useAuthCheck(fetchLatestInfo)



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If the value is an empty string, set it to null
        const sanitizedValue = value === '' ? null : value;

        if (name !== 'date') {
            setFormData((prevData) => ({ ...prevData, [name]: sanitizedValue }));
        }
    
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch('http://127.0.0.1:8000/user_info/create-update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'X-CSRFToken': getCookie('csrftoken'),
            // Include any necessary authentication headers
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('User info saved successfully:', data);
        fetchLatestInfo()
        } catch (error) {
        console.error('Error saving user info:', error);
        }
    };


    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
                <UserInfoNavigation />
                <h2>User Info Form</h2>
                <form onSubmit={handleSubmit} className='user-info-form'>
                    {/* Render form fields with their corresponding values */}
                
                    <label>Weight<input
                        type="number"
                        name="weight"
                        value={formData.weight ===null?'':formData.weight}
                        onChange={handleInputChange}
                    /></label>

                    <label>Height<input
                        type="number"
                        name="height"
                        value={formData.height ===null?'': formData.height}
                        onChange={handleInputChange}
                    /></label>

                    <label>Body Fat Rate<input
                        type="number"
                        name="body_fat_percentage"
                        value={formData.body_fat_percentage ===null?'': formData.body_fat_percentage}
                        onChange={handleInputChange}
                    /></label>

                    <label>Muscle Mass<input
                        type="number"
                        name="muscle_mass"
                        value={formData.muscle_mass ===null?'': formData.muscle_mass}
                        onChange={handleInputChange}
                    /></label>

                    <label>Metablism<input
                        type="number"
                        name="metabolism"
                        value={formData.metabolism ===null?'': formData.metabolism}
                        onChange={handleInputChange}
                    /></label>

                    <label>Target Weight<input
                        type="number"
                        name="target_weight"
                        value={formData.target_weight ===null?'': formData.target_weight}
                        onChange={handleInputChange}
                    /></label>

                    <label>Target Body Fat Rate<input
                        type="number"
                        name="target_body_fat_percentage"
                        value={formData.target_body_fat_percentage ===null?'': formData.target_body_fat_percentage}
                        onChange={handleInputChange}
                    /></label>

                    <label>Target Muscle Mass<input
                        type="number"
                        name="target_muscle_mass"
                        value={formData.target_muscle_mass ===null?'': formData.target_muscle_mass}
                        onChange={handleInputChange}
                    /></label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default UserInfo;

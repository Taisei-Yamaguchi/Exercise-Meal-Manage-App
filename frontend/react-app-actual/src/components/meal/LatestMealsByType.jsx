import React, { useEffect, useState } from 'react';
import getCookie from '../../hooks/getCookie';
// import useAuthCheck from '../../hooks/useAuthCheck';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setMealLoading } from '../../redux/store/LoadingSlice';

const LatestMealByType = ({meal_date,meal_type}) => {
    
    const mealLoading = useSelector((state) => state.loading.mealLoading)
    const [latestMeals,setLatestMeals] =useState([])
    const dispatch =useDispatch()

    useEffect(()=>{
        fetchLatestMeals()
    },[mealLoading])

    // 最新meal
    const fetchLatestMeals = async() => {
        
        const authToken = localStorage.getItem('authToken')
        fetch(`${BACKEND_ENDPOINT}/meal/meal/latest-meals/?meal_type=${meal_type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authToken}`, // トークンを設定
                'X-CSRFToken': getCookie('csrftoken') ,
                // 'X-UserId': user_id,
            },
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch meals');
        })
        .then(latestMeals => {
            setLatestMeals(latestMeals.meals);
            console.log('success fetchLatestMeals!')
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    const handleCreateMeal = async (e) => {
        try {
        dispatch(setMealLoading(true))
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/meal/meal/create-latest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`, // トークンを設定
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            body: JSON.stringify({
                meal_type: meal_type,
                meal_date: meal_date,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Meal created successfully:', data);
            fetchLatestMeals()
            
        } else {
            console.error('Failed to create meal:', response.statusText);
        }
        } catch (error) {
            console.error('Error creating meal:', error.message);
        }finally{
            dispatch(setMealLoading(false))
        }
    };



    return (
        <div className="dropdown dropdown-left dropdown-hover">
            <img 
                src='/icons/copy.svg'
                tabIndex={0} 
                className=" m-1 h-5 w-5" 
                onClick={handleCreateMeal}>    
            </img>
            <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                
                {latestMeals.map((meal)=>(
                    <li key={meal.id}>{meal.food.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default LatestMealByType;

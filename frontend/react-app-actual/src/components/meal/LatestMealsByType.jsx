import React, { useState } from 'react';
import Navigation from '../Navigation';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';
import MealNavigation from './meal-nav/MealNavigation';

const LatestMealByType = ({meal_date,meal_type, onUpdate }) => {
    
    const [latestMeals,setLatestMeals] =useState([])

    // 最新meal
    const fetchLatestMeals = async() => {
        const yourAuthToken = localStorage.getItem('authToken'); 
        fetch(`http://127.0.0.1:8000/meal/meal/latest-meals/?meal_type=${meal_type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${yourAuthToken}`, // トークンを設定
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
            console.log('最新',latestMeals)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    useAuthCheck(fetchLatestMeals);


    const handleCreateMeal = async (e) => {
        const yourAuthToken = localStorage.getItem('authToken');
        try {
        const response = await fetch('http://127.0.0.1:8000/meal/meal/create-latest/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${yourAuthToken}`, // トークンを設定
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
            onUpdate()
        } else {
            console.error('Failed to create meal:', response.statusText);
        }
        } catch (error) {
        console.error('Error creating meal:', error.message);
        }
    };



    return (
        <div className="dropdown dropdown-right dropdown-hover">
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

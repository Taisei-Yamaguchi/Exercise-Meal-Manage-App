import React, { useState, useEffect } from 'react';

import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';


function MealCreateForm({meal_type,meal_date,onUpdate}) {
    
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState('');
    const [serving, setServing] = useState(1);
    

    // API経由でログインユーザーのfoodを取得
    const fetchFoods = async() => {
        const yourAuthToken = localStorage.getItem('authToken'); 
        fetch('http://127.0.0.1:8000/meal/food/list/', {
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
        .then(FoodData => {
            setFoods(FoodData.foods);
            console.log(FoodData)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    useAuthCheck(fetchFoods);



// post meal
    const handleCreateMeal = async () => {
        console.log(meal_type)
        console.log(meal_date)
        const yourAuthToken = localStorage.getItem('authToken');
        try {
        const response = await fetch('http://127.0.0.1:8000/meal/meal/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${yourAuthToken}`, // トークンを設定
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            body: JSON.stringify({
                food: selectedFood,
                serving: serving,
                meal_type: meal_type,
                meal_date: meal_date,
            
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Meal created successfully:', data);
            onUpdate()
        } else {
            console.error('Failed to create meal:', response.statusText);
        }
        } catch (error) {
        console.error('Error creating meal:', error.message);
        }
    };

    return (
        <div className='meal-create'>
        {/* Dropdown for selecting a food item */}
        <label>
            
            <select className='food-select' value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
            <option value="" disabled>Your</option>
            {foods.map((food) => (
                <option key={food.id} value={food.id}>
                {food.name}
                </option>
            ))}
            </select>
        </label>
        <label>
            
            <input type="number" className='food-amount-select' value={serving} onChange={(e) => setServing(e.target.value)} />
            (servings)
        </label>
        
        {/* Button to create the meal */}
        <button className='meal-add-button' onClick={handleCreateMeal}>+</button>
        </div>
    );
}

export default MealCreateForm;

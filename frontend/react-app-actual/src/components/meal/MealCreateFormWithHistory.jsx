import React, { useState, useEffect } from 'react';

import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';


function MealCreateFormWithHistory({meal_type,meal_date,onUpdate}) {
    
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState('');
    const [serving, setServing] = useState(1);
    

    // API経由でログインユーザーのfood historyを取得
    const fetchFoods = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/meal/food/get-searched-food-history/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setFoods(data.foods);
            console.log(data)
        } catch (error) {
            console.error('Error fetching searched food history.:', error);
        }
    };

    useAuthCheck(fetchFoods);



// post meal
    const handleCreateMeal = async (e) => {
        e.preventDefault();
        
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
        <form className='meal-create' onSubmit={handleCreateMeal}>
            <div className="join">
                <select className='food-select select select-bordered join-item select-xs' value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)} required>
                    <option value="" disabled>Your</option>
                        {foods.map((food) => (
                            <option key={food.id} value={food.id}>
                            {food.name}
                            </option>
                        ))}
                </select>
                
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary badge-xs">serving</span> 
                    <input 
                        type="number"
                        value={serving} 
                        onChange={(e) => setServing(e.target.value)} 
                        required min={0.1} 
                        step={0.1}
                        className="food-select input select-bordered join-item select-xs" 
                    />
                </div>
                <div className="indicator">
                    
                    <button className='meal-add-btn btn join-item btn-xs' type='submit'>+</button>
                </div>
            </div>
        </form>
    );
}

export default MealCreateFormWithHistory;

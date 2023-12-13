import React, { useState, useEffect } from 'react';

import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';


function MealCreateForm({meal_type,meal_date,onUpdate}) {
    
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState('');
    const [serving, setServing] = useState(1);
    const [foodCreateTrigger, setFoodCreateTrigger] = useState(false);

    useEffect(() => {
        fetchFoods()
    }, [foodCreateTrigger]);

    const handleFoodUpdate = () => {
        // 何らかのアクションが発生した時にupdateTriggerをトグル
        setFoodCreateTrigger((prev) => !prev);
    };

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
        <form className='w-full' onSubmit={handleCreateMeal}>
        <div className="join">
            <select className='food-select select select-bordered join-item select-xs' value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)} required>
                <option value="" disabled>Custom</option>
                    {foods.map((food) => (
                        <option key={food.id} value={food.id}>
                        {food.name}
                        </option>
                    ))}
            </select>
            
            <div className=" indicator">
                <span className="indicator-item badge badge-secondary badge-xs">serving</span> 
                <input 
                    type="number"
                    value={serving} 
                    onChange={(e) => setServing(e.target.value)} 
                    required min={0.1} 
                    step={0.1}
                    className=" food-select input select-bordered join-item select-xs" 
                />
            </div>
            <div className="indicator">
                <button className='meal-add-btn btn btn-primary join-item btn-xs' type='submit'>+</button>
            </div>
        </div>
        </form>
        
    );
}

export default MealCreateForm;

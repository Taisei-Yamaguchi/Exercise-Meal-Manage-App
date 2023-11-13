import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MealCreateForm({meal_type,meal_date}) {
    
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState('');
    const [serving, setServing] = useState(1);
    const navigate=useNavigate()
    
    
    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else {
            fetchFoods(yourAuthToken); // トークンを使用して食事情報を取得
        }
    }, []);
    

    // API経由でログインユーザーのmealを取得
    const fetchFoods = async(yourAuthToken) => {
        // const user_id = localStorage.getItem'user_id'); // ユーザーIDをlocalStorageから取得
        console.log("Fetch is called.")
        setFoods([]); // 既存のデータをクリア
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

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }



// post meal
    const handleCreateMeal = async () => {
        console.log(meal_type)
        console.log(meal_date)
        try {
        const response = await fetch('http://127.0.0.1:8000/meal/meal/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`, // トークンを設定
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
        } else {
            console.error('Failed to create meal:', response.statusText);
        }
        } catch (error) {
        console.error('Error creating meal:', error.message);
        }
    };

    return (
        <div>
        {/* Dropdown for selecting a food item */}
        <label>
            Select Food:
            <select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
            <option value="" disabled>Select a food</option>
            {foods.map((food) => (
                <option key={food.id} value={food.id}>
                {food.name}
                </option>
            ))}
            </select>
        </label>
        <label>
            Serving:
            <input type="number" value={serving} onChange={(e) => setServing(e.target.value)} />
        </label>
        
        {/* Button to create the meal */}
        <button onClick={handleCreateMeal}>Add</button>
        </div>
    );
}

export default MealCreateForm;

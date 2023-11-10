import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Meal = () => {
    const [meals, setMeals] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            // navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else {
            fetchMeals(yourAuthToken); // トークンを使用して食事情報を取得
        }
    }, []);
    

    // API経由でログインユーザーのmealを取得
    const fetchMeals = async(yourAuthToken) => {
        const user_id = localStorage.getItem('user_id'); // ユーザーIDをlocalStorageから取得

        fetch('http://127.0.0.1:8000/meal/meals/', {
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
        .then(mealData => {
            setMeals(mealData.meals);
            console.log(mealData)
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
    
    

        

    // 例：ログアウト処理
    const handleLogout = () => {
        // ログアウト処理を行い、ログインページにリダイレクトする
        // ...（ログアウトの処理を実装）
        
    };

    return (
        <div>
            <h1>Meal Page</h1>
            <button onClick={handleLogout}>Logout</button>

            <div>
                {meals.map((meal, index) => (
                    <div key={index}>
                        <p>Meal Date: {meal.meal_date}</p>
                        <p>Food: {meal.food}</p>
                        <p>Meal Type: {meal.meal_type}</p>
                        <p>Meal Serving: {meal.meal_serving}</p>
                        <p>Grams: {meal.grams}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Meal;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import MealCreateForm from './MealCreate';
import { useParams } from 'react-router-dom';
// import LogoutButton from './LogoutButton';


const MealDate = () => {
    const { date } = useParams();
    const [meals, setMeals] = useState([]);
    const navigate=useNavigate()
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];


    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else {
            console.log(date)
            fetchMealsByDate(yourAuthToken); // トークンを使用して食事情報を取得
        }
    }, [MealCreateForm]);
    

    // API経由でログインユーザーのmealを取得
    const fetchMealsByDate = async(yourAuthToken) => {
        // const user_id = localStorage.getItem'user_id'); // ユーザーIDをlocalStorageから取得
        console.log("Fetch is called.")
        
        setMeals([]); // 既存のデータをクリア

        const url = `http://127.0.0.1:8000/meal/meals/date/?meal_date=${date}`;

        fetch(url, {
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
    const handleLogout = async () => {
        try {
            const yourAuthToken = localStorage.getItem('authToken');
    
            // バックエンドのログアウトAPIにPOSTリクエストを送信
            await fetch('http://127.0.0.1:8000/accounts/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${yourAuthToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'include',
            });
    
            // ローカルで保持していた認証情報をクリア
            localStorage.removeItem('authToken');
    
            // ログインページにリダイレクト
            navigate('../accounts/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <Navigation />
            <h1>Meal Page</h1>
            <button onClick={handleLogout}>Logout</button>
        
            {mealTypes.map((type) => (
                <div key={type} className='meal-group'>
                <h2>{type} Meals</h2>
                <MealCreateForm meal_type={type} meal_date={date}/>
                {/* Filter meals based on the current type */}
                {meals
                    .filter((meal) => meal.meal_type === type)
                    .map((meal, index) => (
                    <div className={`each-meal ${meal.meal_type}`} key={index}>
                        <p>Meal Date: {meal.meal_date}</p>
                        <p>Food: {meal.food.name}</p>
                        <p>Cal: {meal.food.cal}</p>
                        <p>Meal Type: {meal.meal_type}</p>
                        <p>Meal Serving: {meal.meal_serving}</p>
                    </div>
                    ))}
                </div>
            ))}
            </div>
        );
        
};

export default MealDate;

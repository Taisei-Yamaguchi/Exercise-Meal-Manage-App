import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import MealCreateForm from './MealCreate';
import { useParams } from 'react-router-dom';
import MealUpdate from './MealUpdate';
import MealDelete from './MealDelete';
import getCookie from '../helpers/getCookie';
import { NavLink } from 'react-router-dom';

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
    }, []);
    

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
            <h1>Meal {date}</h1>
            <button onClick={handleLogout}>Logout</button>
        
            {mealTypes.map((type) => (
                <div key={type} className='meal-group'>
                <h2>{type} Meals</h2>
                <NavLink to={`/meal/food-search/${date}/${type}`}>Search</NavLink>
                <MealCreateForm meal_type={type} meal_date={date}/>
                {/* Filter meals based on the current type */}
                {meals
                    .filter((meal) => meal.meal_type === type)
                    .map((meal, index) => (
                    <div className={`each-meal ${meal.meal_type}`} key={index}>
                        <MealUpdate meal={meal} />
                        <MealDelete mealId={meal.id}/>
                        {/* <p>Meal Date: {meal.meal_date}</p> */}
                        <p>{meal.food.name}</p>
                        {/* <p>Cal: {meal.food.cal}</p> */}
                        
                        {meal.serving !== null && meal.serving !== 0 ? (
                            <div>
                                
                                <p>{meal.serving} servings</p>
                                <p>{meal.food.cal * meal.serving} (kcal)</p>
                            </div>
                            ) :(
                            <div>
                                
                                <p>{meal.grams} (g)</p>
                                {meal.food.is_open_api ===true &&  meal.food.is_100g === true ? (
                                    <div>
                                    <p>100gあたりのデータから計算</p>
                                    <p>また、1 servingあたり100gとしてる</p>
                                    <p>{meal.food.cal * (meal.grams / meal.food.amount_per_serving)} kcal</p>
                                    </div>
                                ) : (
                                    <p>{meal.food.cal * (meal.grams / meal.food.amount_per_serving)} kcal</p>
                                )}
                            </div>
                        )}

                        
                    </div>
                    ))}
                </div>
            ))}
            </div>
        );
        
};

export default MealDate;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';

import MealNavigation from './meal-nav/MealNavigation';

import MealCreateForm from './MealCreateForm';
import MealCreateFormWithHistory from './MealCreateFormWithHistory';
import MealUpdate from './MealUpdate';
import MealDelete from './MealDelete';


const MealsByDate = () => {
    const { date } = useParams();
    const [meals, setMeals] = useState([]);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // API経由でログインユーザーのmealを取得
    const fetchMealsByDate = async() => {
        // const user_id = localStorage.getItem'user_id'); // ユーザーIDをlocalStorageから取得
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
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
            console.log(mealData.meals)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    //ログインチェック、パスすればeftchMealsByDateを実行
    useAuthCheck(fetchMealsByDate);

    useEffect(() => {
        fetchMealsByDate();
    }, [updateTrigger]);

    const handleUpdate = () => {
        // 何らかのアクションが発生した時にupdateTriggerをトグル
        setUpdateTrigger((prev) => !prev);
    };
    


    return (
        <div className='container'>
            <Navigation />
                <div className='sub-container'>
                <MealNavigation onUpdate={handleUpdate}/> 
                    <div className='main meal-main'>
                        {/* <h1>Meal {date}</h1> */}
                        {mealTypes.map((type) => (
                            <div key={type} className='meal-group'>
                            <h2>{type}</h2>
                                <div className='meal-add-container'>
                                    <MealCreateForm meal_type={type} meal_date={date} onUpdate={handleUpdate}/>
                                    <MealCreateFormWithHistory meal_type={type} meal_date={date} onUpdate={handleUpdate}/>
                                    <NavLink to={`/meal/food-search/${type}/${date}`}>Search</NavLink>
                                </div>
                            {/* Filter meals based on the current type */}
                            {meals
                                .filter((meal) => meal.meal_type === type)
                                .map((meal, index) => (
                                <div className={`each-meal ${meal.meal_type}`} key={index}>
                                    
                                    <div className='basic-info'>
                                        <p>{meal.food.name}</p>
                                        {meal.serving !== null && meal.serving !== 0 ? (
                                            <div>
                                                <p>({Math.round(meal.food.cal * meal.serving)}kcal)</p>
                                            </div>
                                            ) :(
                                            <div>
                                                {meal.food.is_open_api ===true &&  meal.food.is_100g === true ? (
                                                    
                                                    <p>({Math.round(meal.food.cal * (meal.grams / meal.food.amount_per_serving))} kcal)</p>
                                                    
                                                ) : (
                                                    <p>({Math.round(meal.food.cal * (meal.grams / meal.food.amount_per_serving))} kcal)</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className='meal-btns'>
                                        <MealUpdate meal={meal} onUpdate={handleUpdate}/>
                                        <MealDelete mealId={meal.id} onUpdate={handleUpdate}/>
                                    </div>
                                </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
        
};

export default MealsByDate;

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
import FoodSearch from './FoodSearch';


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
    

    useEffect(() => {
        // 初回レンダリング時に実行
        document.querySelectorAll('.collapse').forEach((collapse) => {
            const inputCheckbox = collapse.querySelector('.peer');
            if (inputCheckbox) {
                inputCheckbox.checked = true; // 初期状態で開いた状態にする
            }
        });
    }, []); // 空の依存リストを指定して初回のみ実行



    return (
            <div className='container'>
            <div className='sub-container'>
                <MealNavigation onUpdate={handleUpdate} />
                <div className='main meal-main'>
                {mealTypes.map((type) => (
                    <div key={type} className='border-b'>
                    <div className="collapse">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-primary-content">
                            <label className="swap">
                            <input type="checkbox" />
                            <div className="swap-on">
                                <img src={`/mealType-svg/${type}.svg`} className="swap-off fill-current w-10 h-10"></img>
                            </div>
                            <div className="swap-off">
                                <img src={`/mealType-svg/${type}.svg`} className="swap-off fill-current w-10 h-10"></img>
                            </div>
                            </label>
                        </div>

                        <div className="collapse-content text-primary-content ">
                            <div className="overflow-x-auto">
                            <div className='meal-add-container mt-1 pt-1'>
                                <MealCreateForm meal_type={type} meal_date={date} onUpdate={handleUpdate} />
                                <MealCreateFormWithHistory meal_type={type} meal_date={date} onUpdate={handleUpdate} />
                                <button className="btn btn-primary btn-xs" onClick={() => document.getElementById(`my_modal_3_${type}`).showModal()}>search</button>
                                <dialog id={`my_modal_3_${type}`} className="modal">
                                <div className="modal-box">
                                    <FoodSearch meal_type={type} date={date} />
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                            <button >✕</button>
                                        </form>
                                </dialog>
                            </div>
                            <table className="table table-xs table-pin-rows table-pin-cols">
                                <thead>
                                <tr>
                                    <td>Meal</td>
                                    <td>Cals(kcal)</td>
                                    <td>Amount(serving/g)</td>
                                    
                                </tr>
                                </thead>
                                <tbody>
                                    {meals
                                    .filter((meal) => meal.meal_type === type)
                                    .map((meal, index) => (
                                        <tr key={meal.id}>
                                        <td>{meal.food.name}</td>
                                        <td>
                                            {meal.serving !== null && meal.serving !== 0 ? (
                                            <p>{Math.round(meal.food.cal * meal.serving)}</p>
                                            ) : (
                                            <div>
                                                <p>{Math.round(meal.food.cal * (meal.grams / meal.food.amount_per_serving))} </p>
                                            </div>
                                            )}
                                        </td>
                                        <td><MealUpdate meal={meal} onUpdate={handleUpdate} /></td>
                                        <td><MealDelete mealId={meal.id} onUpdate={handleUpdate} /></td>
                                        <th></th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        );
        
};

export default MealsByDate;

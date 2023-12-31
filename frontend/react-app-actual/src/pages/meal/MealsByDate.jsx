import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthCheck from '../../helpers/useAuthCheck';
import getCookie from '../../helpers/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';

import MealNavigation from '../../components/meal/meal-nav/MealNavigation';
import MealCreateForm from '../../components/meal/MealCreateForm';
import MealCreateFormWithHistory from '../../components/meal/MealCreateFormWithHistory';
import MealUpdate from '../../components/meal/MealUpdate';
import MealDelete from '../../components/meal/MealDelete';
import FoodSearch from '../../components/meal/FoodSearch';
import LatestMealByType from '../../components/meal/LatestMealsByType';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToastMes } from '../../redux/store/ToastSlice';


const MealsByDate = () => {
    const { date } = useParams();
    const [meals, setMeals] = useState([]);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const toastMes = useSelector((state) => state.toast.toastMes);
    const toastClass = useSelector((state) => state.toast.toastClass);
    const updateContentLoading = useSelector((state)=> state.loading.updateContentLoading)
    const updateContentId = useSelector((state)=> state.loading.updateContentId)
    const mealLoading = useSelector((state) => state.loading.mealLoading)
    const dispatch = useDispatch()

    useAuthCheck();

    // clear toastMes
    const clearToastMes = ()=>{
        dispatch(setToastMes(''))
    }


    // open collapse first render.
    useEffect(() => {
        document.querySelectorAll('.collapse').forEach((collapse) => {
            const inputCheckbox = collapse.querySelector('.peer');
            if (inputCheckbox) {
                inputCheckbox.checked = true; // 初期状態で開いた状態にする
            }
        });
    }, []);


    // fetch Meals when load
    useEffect(()=>{
        fetchMealsByDate()
    },[mealLoading])


    // API経由でログインユーザーのmealを取得
    const fetchMealsByDate = async() => {
        const authToken = localStorage.getItem('authToken')
        const url = `${BACKEND_ENDPOINT}/meal/meals/date/?meal_date=${date}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${authToken}`, // トークンを設定
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
            console.log('Success fetchMealsData!')
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    // render
    return (
            <div className='container'>
            <div className='sub-container'>
                <MealNavigation />
                <div className='sm:mt-14 pt-80 max-sm:pt-96'>
                {mealTypes.map((type) => (
                    <div key={type} className='border-b'>

                    <div className="collapse">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-primary-content pb-0">
                            <label className="swap">
                            <input type="checkbox" />
                            <div className="swap-on flex justify-between items-center">
                                <img src={`/mealType-svg/${type}.svg`} className="swap-off fill-current w-8 h-8 pr-3"></img>
                                <strong>{type}</strong>
                            </div>
                            <div className="swap-off flex justify-between items-center">
                                <img src={`/mealType-svg/${type}.svg`} className=" swap-off fill-current w-8 h-8 pr-3"></img>
                                <strong>{type}</strong>
                            </div>
                            </label>
                        </div> 

                        <div className="collapse-content text-primary-content ">
                            <div className="overflow-x-auto">
                            <div className='border  mt-1 pt-1 flex max-sm:flex-row max-sm:items-center'>
                                <img 
                                    src='/icons/search.svg'
                                    className="btn btn-xs btn-ghost w-8 h-8" onClick={() => document.getElementById(`my_modal_3_${type}`).showModal()}
                                ></img>
                                    <dialog id={`my_modal_3_${type}`} className="modal">
                                        <div className="modal-box">
                                            <FoodSearch meal_type={type} date={date}/>
                                        </div>
                                        
                                        {/* toast mes */}
                                        {toastMes && toastMes !=='' &&(
                                                <div className="toast">
                                                    <div className={`alert ${toastClass}`}>
                                                        <span>{toastMes}</span>
                                                    </div>
                                            </div>)}

                                        <form method="dialog" className="modal-backdrop" onClick={clearToastMes}>
                                            <button >✕</button>
                                        </form>
                                    </dialog>
                                    
                                <div className='flex flex-row'>
                                    <div className='flex flex-row max-sm:flex-col'>
                                        <MealCreateForm meal_type={type} meal_date={date} />
                                        <MealCreateFormWithHistory meal_type={type} meal_date={date}  />    
                                    </div>
                                    <LatestMealByType meal_type={type} meal_date={date}/>
                                </div>
                            </div>

                            <table className="border mr-1 table table-xs table-pin-rows table-pin-cols">
                                <thead>
                                <tr>
                                    <td>Meal</td>
                                    <td>kcal</td>
                                    <td>Amount</td>
                                    
                                </tr>
                                </thead>
                                <tbody >
                                    {meals
                                    .filter((meal) => meal.meal_type === type)
                                    .map((meal, index) => (

                                        updateContentLoading && updateContentId === meal.id ? (
                                            <tr key={`loading-${meal.id}`} className="loading loading-bars loading-lg">
                                            </tr>
                                        ):(
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
                                            <td><MealUpdate meal={meal} /></td>
                                            <td><MealDelete mealId={meal.id} /></td>
                                            <th></th>
                                            </tr>
                                        )
                                    ))}

                                    {mealLoading &&(
                                        <tr key={`meal-loading-${type}`} className="loading loading-bars loading-lg">
                                        </tr>
                                    )}
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

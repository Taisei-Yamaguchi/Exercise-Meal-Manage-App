import React, { useEffect, useState } from 'react';
// import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setMealLoading } from '../../redux/store/LoadingSlice';

function MealCreateFormWithHistory({meal_type,meal_date}) {

    const dispatch =useDispatch()
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState('');
    const [serving, setServing] = useState(1);
    
    useEffect(()=>{
        fetchFoods()
    },[])
    
    // API経由でログインユーザーのfood historyを取得
    const fetchFoods = async() => {
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/meal/food/get-searched-food-history/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setFoods(data.foods);
            console.log('succcess fetchFoods (History)!')
        } catch (error) {
            console.error('Error fetching searched food history.:', error);
        }
    };

// post meal
    const handleCreateMeal = async (e) => {
        e.preventDefault();
        
        try {
        dispatch(setMealLoading(true))
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/meal/meal/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`, // トークンを設定
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
        } finally{
            dispatch(setMealLoading(false))
        }
    };



    return (
        <form className='w-full' onSubmit={handleCreateMeal}>
            <div className="join">
                <select className=' food-select select select-bordered join-item select-xs' value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)} required>
                    <option value="" disabled>History</option>
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

export default MealCreateFormWithHistory;

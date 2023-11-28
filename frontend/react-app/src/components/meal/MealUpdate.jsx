// MealUpdateForm.js

import React, { useState } from 'react';
import getCookie from '../helpers/getCookie';

function MealUpdate({ meal }) {
    const [serving, setServing] = useState(meal.serving);
    const [grams,setGrams] =useState(meal.grams);

    const handleUpdateMeal = async () => {
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/meal/meal/update/${meal.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    serving: serving,
                    grams: grams,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Meal updated successfully:', data);
            } else {
                console.error('Failed to update meal:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating meal:', error.message);
        }
    };

    

    return (
        <div>
            <label>
                Serving:
                <input type="number" value={serving === null ? '':serving} 
                onChange={(e) => setServing(e.target.value === '' ? null : parseFloat(e.target.value))} />
            </label>
            <br></br>
            {meal.food.is_open_api ===true &&  meal.food.is_serving === true ?(
                <div>
                <p>これに対応するfoodは、1 servingあたりのデータ</p>
                <p>amount_per_servingが不明なため、grams数指定不可</p>
                </div>
            ):(
                <label>
                    Grams:
                    <input type="number" value={grams === null ? '' : grams} 
                    onChange={(e) => setGrams(e.target.value === '' ? null : parseFloat(e.target.value))} />
                </label>
            )}
            
            <button onClick={handleUpdateMeal}>Update</button>
        </div>
    );
}

export default MealUpdate;

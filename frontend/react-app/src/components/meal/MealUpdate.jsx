// MealUpdateForm.js

import React, { useState } from 'react';
import getCookie from '../helpers/getCookie';

function MealUpdate({ mealId }) {
    const [serving, setServing] = useState(1);
    const [grams,setGrams] =useState(0);

    const handleUpdateMeal = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/meal/meal/update/${mealId}/`, {
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
                <input type="number" value={serving} onChange={(e) => setServing(e.target.value)} />
            </label>
            <br></br>
            <label>
                Grams:
                <input type="number" value={grams} onChange={(e) => setGrams(e.target.value)} />
            </label>
            <button onClick={handleUpdateMeal}>Update</button>
        </div>
    );
}

export default MealUpdate;

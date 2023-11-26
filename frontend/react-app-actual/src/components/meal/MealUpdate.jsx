import React, { useState,useEffect } from 'react';
import getCookie from '../../hooks/getCookie';

function MealUpdate({ meal,onUpdate }) {
    const [serving, setServing] = useState(meal.serving);
    const [grams,setGrams] =useState(meal.grams);
    const [isServingSelected, setIsServingSelected] = useState(!(meal.serving === null || meal.serving === 0));

    const handleUpdateMeal = async (e) => {
        e.preventDefault()
        if((serving!==null&&grams!==null) || (serving===null&&grams===null)){
            window.alert('Please write only one form.');
            return
        }
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
                onUpdate()
            } else {
                console.error('Failed to update meal:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating meal:', error.message);
        }
    };

    
    useEffect(() => {
        if (isServingSelected) {
            setGrams(null);
        } else {
            setServing(null);
        }
    }, [isServingSelected])

    return (
        <>
        <form className='meal-update' onSubmit={handleUpdateMeal}>
            {
                isServingSelected?(
                    <label>
                        <input type="number"  className='food-amount-select' value={serving === null ? '':serving} 
                        onChange={(e) => setServing(e.target.value === '' ? null : parseFloat(e.target.value))} min={0.1} step={0.1}/>(servings)
                    </label>
            
            ):(
                <>
                    {meal.food.is_open_api ===true &&  meal.food.is_serving === true ?(
                        <div></div>
                    ):(
                        <div>
                        <label>
                            <input type="number" className='food-amount-select' value={grams === null ? '' : grams} 
                            onChange={(e) => setGrams(e.target.value === '' ? null : parseFloat(e.target.value))} min={0.1} step={0.1}/>(g)
                        </label>
                        <br></br>
                        </div>
                        
                    )}
                </>
            )}
            
            <button className='meal-update-button' type='submit'>U</button>
        </form>
            <button className='serving-toggle-button' onClick={() => setIsServingSelected(!isServingSelected)}>
            change
        </button>
    </>
    );
}

export default MealUpdate;

import React, { useState } from 'react';
import getCookie from '../helpers/getCookie';

function MealDelete({ mealId }){
    const handleDeleteMeal = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/meal/meal/delete/${mealId}/`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'X-CSRFToken': getCookie('csrftoken'),
                },
            });
        
            if (response.ok) {
                console.log('Meal deleted successfully');
                // 削除後のリフレッシュなどが必要ならば、その処理を追加
            } else {
                console.error('Failed to delete meal:', response.statusText);
            }
            } catch (error) {
            console.error('Error deleting meal:', error.message);
            }
    };



    return (
        <div className='delete-button'>
            <button onClick={handleDeleteMeal}>Delete</button>
        </div>
    );
}

export default MealDelete;



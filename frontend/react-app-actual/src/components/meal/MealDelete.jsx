import React from 'react';
import getCookie from '../../hooks/getCookie';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';

import { useDispatch } from 'react-redux';
import { setUpdateContentLoading } from '../../redux/store/LoadingSlice';
import { setUpdateContentId } from '../../redux/store/LoadingSlice';

function MealDelete({ mealId,onUpdate }){
    const dispatch = useDispatch()

    const handleDelete = async () => {
        try {
            dispatch(setUpdateContentLoading(true))
            dispatch(setUpdateContentId(mealId))

            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/meal/meal/delete/${mealId}/`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
                },
            });
        
            if (response.ok) {
                console.log('Meal deleted successfully');
                // 削除後のリフレッシュなどが必要ならば、その処理を追加
                onUpdate()
            } else {
                console.error('Failed to delete meal:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting meal:', error.message);
        } finally {
            dispatch(setUpdateContentLoading(false))
            dispatch(setUpdateContentId(mealId))
        }
    };



    return (
        <button className="badge badge-xs badge-error" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    );
}

export default MealDelete;



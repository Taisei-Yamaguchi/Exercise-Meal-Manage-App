import React from 'react';
import getCookie from '../../helpers/getCookie';
import { BACKEND_ENDPOINT } from '../../settings';
import { useDispatch } from 'react-redux';
import { setExerciseLoading } from '../../redux/store/LoadingSlice';

const ExerciseDelete = ({ exerciseId}) => {
    const dispatch = useDispatch()

    // handleDelete
    const handleDelete = async () => {
        try {
        dispatch(setExerciseLoading(true))
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/exercise/exercise/delete/${exerciseId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (response.ok) {
            console.log('Delete success')
        } else {
            console.error('Failed to delete exercise');
        }
        } catch (error) {
            console.error('Failed to delete exercise', error);
        } finally{
            dispatch(setExerciseLoading(false))
        }
    };

    // render
    return (
        <button className="badge badge-xs badge-error" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    );
};

export default ExerciseDelete;
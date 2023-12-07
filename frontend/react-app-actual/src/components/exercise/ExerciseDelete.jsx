import React from 'react';
import getCookie from '../../hooks/getCookie';

const ExerciseDelete = ({ exerciseId, onUpdate }) => {
    const handleDelete = async () => {
        try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://127.0.0.1:8000/exercise/exercise/delete/${exerciseId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        if (response.ok) {
             // 親コンポーネントでリストを更新するなどの処理を実行
            console.log('Delete success')
            onUpdate()
        } else {
            console.error('Failed to delete exercise');
        }
        } catch (error) {
        console.error('Failed to delete exercise', error);
        }
    };

    return (
        <button className="btn btn-square btn-xs btn-error" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    );
};

export default ExerciseDelete;
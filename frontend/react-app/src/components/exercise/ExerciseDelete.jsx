import React from 'react';
import getCookie from '../helpers/getCookie';

const ExerciseDeleteButton = ({ exerciseId, onDelete }) => {
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
        } else {
            console.error('Failed to delete exercise');
        }
        } catch (error) {
        console.error('Failed to delete exercise', error);
        }
    };

    return (
        <button onClick={handleDelete}>Delete</button>
    );
};

export default ExerciseDeleteButton;
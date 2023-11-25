// src/components/account/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import getCookie from '../../hooks/getCookie';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const yourAuthToken = localStorage.getItem('authToken');

            // バックエンドのログアウトAPIにPOSTリクエストを送信
            await fetch('http://127.0.0.1:8000/accounts/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${yourAuthToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'include',
            });

            // ローカルで保持していた認証情報をクリア
            localStorage.removeItem('authToken');

            // ログインページにリダイレクト
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;

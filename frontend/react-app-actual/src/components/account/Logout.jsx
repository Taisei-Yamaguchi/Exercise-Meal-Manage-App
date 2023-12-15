import React from 'react';
import { useNavigate } from 'react-router-dom';
import getCookie from '../../hooks/getCookie';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const authToken = localStorage.getItem('authToken')
            // バックエンドのログアウトAPIにPOSTリクエストを送信
            await fetch(`${BACKEND_ENDPOINT}/accounts/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
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

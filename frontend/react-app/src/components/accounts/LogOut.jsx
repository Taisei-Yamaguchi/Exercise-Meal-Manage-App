import React from 'react';
import axios from 'axios';

const LogoutButton = ({ handleLogout }) => {
    const handleLogoutClick = async () => {
        try {
            // バックエンドのログアウトAPIにPOSTリクエストを送信
            await axios.post('/accounts/logout/');
            // ローカルで保持していた認証情報をクリア
            handleLogout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogoutClick}>
            Logout
        </button>
    );
};

export default LogoutButton;

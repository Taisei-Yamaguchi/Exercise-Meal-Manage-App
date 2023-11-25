// PasswordResetPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const PasswordResetProcess = () => {
    const [newPassword, setNewPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const [mes,setMes] = useState('');

    const { uid, token} = useParams();
    

    const handlePasswordReset = async () => {
        if(newPassword===againPassword && newPassword.length>6){
            try {
                const response = await axios.post('http://127.0.0.1:8000/accounts/reset-password-confirm/', {
                    uid,
                    token,
                    new_password: newPassword,
                });

                const data=response.data
                console.log(data);  // バックエンドからのレスポンスを確認
                setMes(data.detail)
        
                } catch (error) {
                console.error(error);
                // エラー処理を行う
                }
        }else{
            setMes('Please write same password.(minimum is 6 words.)')
        }
        
    };

    return (
        <div>
            <Navigation />
            <h2>Password Reset</h2>
            <label htmlFor="new-password">New Password:</label>
            <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                id="again-password"
                value={againPassword}
                onChange={(e) => setAgainPassword(e.target.value)}
            />
            <button onClick={handlePasswordReset}>Reset Password</button>
            {mes}
        </div>
        
    );
};

export default PasswordResetProcess;

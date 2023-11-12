// PasswordResetPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const { uid, token} = useParams();
  const navigation=useNavigate();

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/reset_password_confirm/', {
        uid,
        token,
        new_password: newPassword,
      });
      console.log(response.data);  // バックエンドからのレスポンスを確認
      // パスワードリセットが成功したら適切な処理を行う
      navigation('/accounts/login')

    } catch (error) {
      console.error(error);
      // エラー処理を行う
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <label htmlFor="new-password">New Password:</label>
      <input
        type="password"
        id="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Reset Password</button>
    </div>
  );
};

export default PasswordResetPage;

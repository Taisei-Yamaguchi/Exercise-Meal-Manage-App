// PasswordResetRequestPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handlePasswordResetRequest = async () => {
    try {
      // バックエンドにメール送信の要求を送信
      const response = await axios.post('http://127.0.0.1:8000/accounts/reset-password-request/', {
        email,
      });
      console.log(response.data);  // バックエンドからのレスポンスを確認
      // リクエストが成功したら状態を更新
      setRequestSent(true);
    } catch (error) {
      console.error(error);
      // エラー処理を行う
    }
  };

  return (
    <div>
      <Navigation />
      <h2>Password Reset Request</h2>
      {requestSent ? (
        <p>Check your email for the password reset link.</p>
      ) : (
        <>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handlePasswordResetRequest}>Request Password Reset</button>
        </>
      )}
    </div>
  );
};

export default PasswordResetRequest;

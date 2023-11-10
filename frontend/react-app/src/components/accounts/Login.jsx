import React, { useState } from 'react';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useState(''); 
    const navigate=useNavigate()

    const handleLogin = async () => {
        const userCredentials = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            });

            if (response.ok) {
                // ログイン成功時の処理
                console.log('Logged in successfully!');
                const userData = await response.json();
                console.log(userData.token)
                setAuthToken(userData.token);
                localStorage.setItem('authToken', userData.token);
                localStorage.setItem('user_id', userData.id);
                navigate('/meals');
            } else {
                // ログイン失敗時の処理
                console.log(response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Navigation />
            <h1>Login</h1>
            <input
                type="text"
                placeholder="E-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>

            {/* ログインユーザー情報を表示
            <div>
                {loginUser && (
                    <div>
                        <h2>Logged In User Details</h2>
                        <p>Email: {loginUser.email}</p>
                        <p>Name: {loginUser.name}</p>
                        <p>BirthDay: {loginUser.birthday}</p>
                        <p>Sex: {loginUser.sex ? 'female' : 'male'}</p>
                        <p>Metabolism: {loginUser.metabolism}</p>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default Login;

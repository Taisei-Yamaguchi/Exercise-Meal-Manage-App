import React, { useState } from 'react';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useState(''); 
    const navigate=useNavigate()
    const [mes,setMes] =useState('')

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
                setAuthToken(userData.token);
                localStorage.setItem('authToken', userData.token);
                
                navigate('/dashboard');
            } else {
                // ログイン失敗時の処理
                console.log(response.json());
                setMes('Login Failed.')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
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
                <p><NavLink to="/password-reset/request">Did you forget your password?</NavLink></p>
                {mes}
            </div>
        </div>
    );
};

export default Login;

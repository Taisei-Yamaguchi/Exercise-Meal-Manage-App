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
                <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="email" 
                            className="input input-bordered" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        </div>
                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="input input-bordered" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <label className="label">
                            <NavLink className="label-text-alt link link-hover" to="/password-reset/request">Forgot password?</NavLink>
                        </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                        </div>
                        {mes ==='' ?(
                            <></>
                        ):(
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{mes}</span>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

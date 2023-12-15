import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { BACKEND_ENDPOINT } from '../../settings';
// import { authToken } from '../../helpers/getAuthToken';

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
            const response = await fetch(`${BACKEND_ENDPOINT}/accounts/login/`, {
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
                // setAuthToken(userData.token);
                localStorage.setItem('authToken', userData.token);
                console.log(localStorage.getItem('authToken'));
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
            <div className='sub-container'>
                <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <div className="drawer open-nav">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer" className="btn btn-circle swap swap-rotate drawer-button">
                                    {/* this hidden checkbox controls the state */}
                                    <input type="checkbox" />
                                    <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                                    <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                                </label>
                            </div> 
                            <div className="drawer-side">
                                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                <Navigation />
                            </div>
                        </div>
                    </div>
                    <div className=" shrink-0 w-full max-w-sm shadow-2xl bg-base-100 ">
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

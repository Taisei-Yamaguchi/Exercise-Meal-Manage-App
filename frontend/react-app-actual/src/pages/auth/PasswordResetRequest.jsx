// PasswordResetRequestPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import { BACKEND_ENDPOINT } from '../../settings';

const PasswordResetRequestPage = () => {
    const [email, setEmail] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [errorMes,setErrorMes] =useState('');

    const handlePasswordResetRequest = async () => {
        try {
        // バックエンドにメール送信の要求を送信
        const response = await axios.post( `${BACKEND_ENDPOINT}/accounts/reset-password-request/`, {
            email,
        });
        setRequestSent(true)
            
        }catch (error) {
            console.error(error);
            // エラー処理を行う
            if (error.response && error.response.status === 404) {
                setErrorMes('Sorry, email cannot be found.');
            } else {
                console.error(error);
            }
        // エラー処理を行う
        };
    }

    return (
        <div className='container'>
            <div className='sub-container'>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <div className="drawer open-nav">
                        <h1 className="text-5xl font-bold">Password Reset Request</h1>
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
                <div className="shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    {requestSent ? (
                                <div role="alert" className="alert alert-info">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Sending links to your email and reset password.</span>
                                </div>
                            ) : (
                                <>
                                <div className="card-body">
                                    <div className="form-control">
                                    <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered" 
                            required />
                        </div>
                        
                        <div className="form-control mt-6">
                        <button className="btn btn-primary" onClick={handlePasswordResetRequest}>Reset Password Request</button>
                        </div>
                    </div>
                    {errorMes ==='' ?(
                        <></>
                        ):(
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{errorMes}</span>
                            </div>
                    )}
                    </>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default PasswordResetRequestPage;

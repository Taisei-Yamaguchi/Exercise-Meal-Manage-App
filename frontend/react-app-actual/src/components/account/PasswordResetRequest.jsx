// PasswordResetRequestPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';

const PasswordResetRequestPage = () => {
    const [email, setEmail] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [errorMes,setErrorMes] =useState('');

    const handlePasswordResetRequest = async () => {
        try {
        // バックエンドにメール送信の要求を送信
        const response = await axios.post('http://127.0.0.1:8000/accounts/reset-password-request/', {
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
            <Navigation />
            <div className='sub-container'>
                

<div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Password Reset Request</h1>
        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        
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

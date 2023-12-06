// PasswordResetPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';

const PasswordResetProcess = () => {
    const [newPassword, setNewPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const [errorMes,setErrorMes] = useState('');
    const [successMes,setSuccessMes] = useState('');

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
                if (data.error) {
                    setErrorMes(data.error);
                    setSuccessMes('');
                }else{
                    setErrorMes('');
                    setSuccessMes(data.detail);
                }
        
                } catch (error) {
                console.error(error);
                setErrorMes('Error happend!')
                }
        }else{
            setErrorMes('Please write same password.(minimum is 6 words.)')
        }
        
    };

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container'>

                <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Reset Password!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        
                        <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="input input-bordered" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        />
                        
                        <div className="form-control">
                        <input 
                            type="password" 
                            placeholder="Re-enter Password" 
                            className="input input-bordered" 
                            value={againPassword}
                            onChange={(e) => setAgainPassword(e.target.value)}
                            required 
                        />
                        </div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" onClick={handlePasswordReset}>Reset Password</button>
                        </div>
                        {errorMes ==='' ?(
                            <></>
                        ):(
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{errorMes}</span>
                            </div>
                        )}

                        {successMes ==='' ?(
                            <></>
                        ):(
                            <div role="alert" className="alert alert-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{successMes}</span>
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

export default PasswordResetProcess;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BACKEND_ENDPOINT } from '../../settings';


const SignUpConfirm = () => {
    const { uid, token } = useParams();
    const [mes,setMes] =useState('');
    const [errorMes,setErrorMes] =useState('');
    const [loading,setLoading] =useState(false)
    
        const confirmEmail = async () => {
            try {
                setLoading(true)
                const response = await axios.post(`${BACKEND_ENDPOINT}/accounts/signup-confirmation/`, { uid, token });
                const data = response.data;
                
                if (data.error) {
                    setErrorMes(data.error);
                    setMes('')
                }else{
                    setMes(data.detail);
                    setErrorMes('')
                }
                
            } catch (error) {
                console.error(error);
                setErrorMes('Error happend!')
            } finally{
                setLoading(false)
            }
        };

    
        return (
        <div className='container'>
            <div className='sub-container'>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Activate Account</h1>
                    <p className="py-6">Click button and activate your account. If aren't sure this. Don't click and ignore.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    {errorMes!=='' && (
                    <div role="alert" className="alert alert-error text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 " fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMes}</span>
                    </div>
                    )}

                    {mes!=='' && (
                    <div role="alert" className="alert alert-success text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{mes}</span>
                    </div>
                    )}

                    {loading ?(
                        <span className="loading loading-spinner loading-md"></span>
                    ):(
                        <button className="btn btn-primary" onClick={confirmEmail}>Activate Account</button>
                    )}
                    <Link to='/login' className="label-text-alt link link-hover">Login </Link>
                </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    };

export default SignUpConfirm;
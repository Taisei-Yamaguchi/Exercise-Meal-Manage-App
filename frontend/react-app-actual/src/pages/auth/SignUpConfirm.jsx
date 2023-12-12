import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import { Link } from 'react-router-dom';

const SignUpConfirm = () => {
    const { uid, token } = useParams();
    const [mes,setMes] =useState('');
    const [errorMes,setErrorMes] =useState('');
    
        const confirmEmail = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/accounts/signup-confirmation/', { uid, token });

                const data = response.data;
                
                if (data.error) {
                    setErrorMes(data.error);
                }else{
                    setMes(data.detail);
                }
                
            } catch (error) {
                console.error(error);
                setErrorMes('Error happend!')
            }
        };

        useEffect(()=>{
            confirmEmail()
        },[])
    
        return (
        <div className='container'>
            <div className='sub-container'>

            {errorMes ==='' ?(
                <></>
            ):(
                <div role="alert" className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{errorMes}</span>
                </div>
            )}

            {mes ==='' ?(
                <></>
            ):(
                <div role="alert" className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{mes}</span>
                </div>
            )}
            <Link to='/login'>Login </Link>
            </div>
        </div>
        );
    };

export default SignUpConfirm;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';

const SignUpConfirm = () => {
    const { uid, token } = useParams();
    const [mes,setMes] =useState();
    
        const confirmEmail = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/accounts/signup-confirmation/', { uid, token });

                const data = response.data;
                setMes(data.detail);
                
            } catch (error) {
                console.error(error);
            }
        };
    
        return (
        <div>
            <Navigation />
            <p>Confirmation in progress...</p>
            {/* Add a button to trigger the confirmEmail function */}
            <button onClick={confirmEmail}>Confirm Email</button>
            {mes}
            <Link to='/login'>Login </Link>
        </div>
        );
    };

export default SignUpConfirm;
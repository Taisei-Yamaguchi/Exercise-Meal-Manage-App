import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ConfirmationPage = () => {
    const { uid, token } = useParams();
    
        const confirmEmail = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/accounts/signup_confirmation/', { uid, token });
                console.log(response.data);  // バックエンドからのレスポンスを確認
            } catch (error) {
                console.error(error);
            }
        };
    
        return (
        <div>
            <p>Confirmation in progress...</p>
            {/* Add a button to trigger the confirmEmail function */}
            <button onClick={confirmEmail}>Confirm Email</button>
        </div>
        );
    };

export default ConfirmationPage;
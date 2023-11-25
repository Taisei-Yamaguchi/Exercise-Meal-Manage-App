// src/hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.log('Token Error');
            navigate('/login');
        }
    }, [navigate]);

    return {
        // 他に必要な場合、フックから返すデータや関数を追加できます
    };
};

export default useAuthCheck;

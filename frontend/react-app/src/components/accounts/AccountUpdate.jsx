import React, { useState } from 'react';
import Navigation from '../Navigation';
import getCookie from '../helpers/getCookie';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AccountUpdate = () => {
    const [userData, setUserData] = useState({
        name: '',
        picture: null,
        sex: 0,
        birthday: '',
    });
    const [mes,setMes]=useState('')
    const navigate= useNavigate()

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken');
        if (!yourAuthToken) {
            console.log('Token Error');
            navigate('../accounts/login');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/accounts/update/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            console.log(data); // サーバーからのレスポンスをログ出力
            
            setMes('Update Success')
        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Navigation />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={userData.name}
                    onChange={handleChange}
                />
                
                
                <div>
                    <label>
                        Male
                        <input
                            type="radio"
                            value={0}
                            checked={userData.sex === 0}
                            onChange={(e) => setUserData({ ...userData, sex: parseInt(e.target.value) })}
                        />
                    </label>
                    <label>
                        Female
                        <input
                            type="radio"
                            value={1}
                            checked={userData.sex === 1}
                            onChange={(e) => setUserData({ ...userData, sex: parseInt(e.target.value) })}
                        />
                    </label>
                </div>
                <input type="date" name="birthday" value={userData.birthday} onChange={handleChange} />
                <button type="submit">Update Account</button>
            </form>
            {mes}
        </div>
    );
};

export default AccountUpdate;

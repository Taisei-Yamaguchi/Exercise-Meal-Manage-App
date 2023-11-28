import React, { useState } from 'react';
import Navigation from '../Navigation';
import getCookie from '../../hooks/getCookie';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthCheck from '../../hooks/useAuthCheck';

const SettingsAccount = () => {
    const [name, setName] = useState('');
    const [picture, setPicture] = useState(null);
    const [sex, setSex] = useState(false);
    const [birthday, setBirthday] = useState('');

    const [email, setEmail] = useState('');

    const [mes,setMes]=useState('')
    const navigate= useNavigate()
    

    const fetchAccount = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/accounts/get/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                }
            });
            const data = await response.json();

            console.log(data); // サーバーからのレスポンスをログ出力
            setName(data.name);
            setPicture(data.picture);
            setSex(data.sex);
            setBirthday(data.birthday);
            setEmail(data.email_address)
            
        } catch (error) {
            console.error('Error:', error);
            // エラーハンドリング
        }
    };

    useAuthCheck(fetchAccount)

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
                body: JSON.stringify({ name, picture, sex, birthday }),
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
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'picture':
                // 画像の処理を実装
                setPicture(e.target.value);
                break;
            case 'sex':
                // setSex(e.target.checked);
                setSex(e.target.value === 'true');
                break;
            case 'birthday':
                setBirthday(e.target.value);
                break;
            default:
                break;
        }
    };



    return (
        <div className='container'>
            <Navigation />
            <form onSubmit={handleSubmit}>
                <input
                    className='account-name'
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={handleChange}
                />
                <p>email: {email}</p>
                <div className='account-sex'>
                    <label>
                        Male
                        <input
                            type="radio"
                            name='sex'
                            value={false}
                            checked={sex === false}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Female
                        <input
                            type="radio"
                            name='sex'
                            value={true}
                            checked={sex === true}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <input 
                    className='account-birthday'
                    type="date"  
                    name="birthday" 
                    value={birthday} 
                    onChange={handleChange} 
                />
                <button type="submit">Update Account</button>
            </form>
            {mes}
        </div>
    );
};

export default SettingsAccount;

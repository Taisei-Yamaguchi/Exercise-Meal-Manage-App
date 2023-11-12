import React, { useState } from 'react';
import Navigation from '../Navigation';

const SignUp = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        passwordAgain: '',
        picture: null,
        sex: 0,
        birthday: '',
    });
    const [mes,setMes]=useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.passwordAgain) {
            console.log("Passwords do not match");
            return;
        }
        try {
            const dataToSend = {
                ...userData,
                username: userData.email // emailをusernameに自動割り当て
            };
            const response = await fetch('http://127.0.0.1:8000/accounts/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            const data = await response.json();
            console.log(data); // サーバーからのレスポンスをログ出力
            
            setMes('We sent the link to yur email. Please check and avtivate your account. Your account is not available yet.')
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
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="passwordAgain"
                    placeholder="Re-enter Password"
                    value={userData.passwordAgain}
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
                <button type="submit">Sign Up</button>
            </form>
            {mes}
        </div>
    );
};

export default SignUp;

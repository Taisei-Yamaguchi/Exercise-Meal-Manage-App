import React, { useState } from 'react';

const AccountCreateForm = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        picture: null,
        sex: 0,
        birthday: '',
        metabolism: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/accounts/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            console.log(data); // レスポンスを確認

            setUser({
                username: '',
                email: '',
                password: '',
                picture: null,
                sex: 0,
                birthday: '',
                metabolism: 0,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" />
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" />
            <div>
            <label>
                Male
                <input
                    type="radio"
                    value={0}
                    checked={user.sex === 0}
                    onChange={(e) => setUser({ ...user, sex: parseInt(e.target.value) })}
                />
            </label>
            <label>
                Female
                <input
                    type="radio"
                    value={1}
                    checked={user.sex === 1}
                    onChange={(e) => setUser({ ...user, sex: parseInt(e.target.value) })}
                />
            </label>

            </div>
            <input type="date" name="birthday" value={user.birthday} onChange={handleChange} />
            <input type="number" name="metabolism" value={user.metabolism} onChange={handleChange} placeholder="Metabolism" />
            <button type="submit">Create Account</button>
        </form>
    );
};

export default AccountCreateForm;

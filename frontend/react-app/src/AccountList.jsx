import React, { useState, useEffect } from 'react';
function AccountList() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchUsers = () => {
            fetch('http://127.0.0.1:8000/accounts/list/') // DjangoサーバーのURLに合わせて変更してください
                .then(response => response.json())
                .then(data => {
                    setUsers(data);
                    console.log(data); // レスポンスデータを確認
                })
                .catch(error => console.error('Error:', error));
        };

        fetchUsers();
    }, []);
    
    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}



export default AccountList;

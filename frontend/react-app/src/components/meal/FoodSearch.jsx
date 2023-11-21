import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import getCookie from '../helpers/getCookie';

const FoodSearch = () => {
    const [searchExpression, setSearchExpression] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const navigate=useNavigate();

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } 
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/meal/meal/food-search/?search_expression=${searchExpression}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Food Search successfully:', data);
                setSearchResults(data);
            } else {
                console.error('Failed to Food Search:', response.statusText);
            }
        } catch (error) {
            console.error('Error food search:', error.message);
        }
    };

    return (
        <div>
        <input
            type="text"
            placeholder="Enter food name"
            value={searchExpression}
            onChange={(e) => setSearchExpression(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <ul>
        {searchResults.map((result) => (
            <li key={result.food_id}>{result.name}:{result.cals}(cals/100g)</li>
        ))}
        </ul>
        </div>
    );
};

export default FoodSearch;

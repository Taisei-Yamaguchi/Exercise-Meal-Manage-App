import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import getCookie from '../helpers/getCookie';
import { useParams } from 'react-router-dom';
import Navigation from '../Navigation';

const FoodSearch = () => {
    const {date,meal_type}=useParams();
    
    const [searchExpression, setSearchExpression] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const mealData ={
        'meal_date':date,
        'serving':1,
        'meal_type':meal_type,
    }

    const [mes,setMes] = useState('')
    const navigate=useNavigate();

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } 
    }, []);

    const handleSearch = async () => {
        const escapedSearchExpression = searchExpression.replace(/&/g, '%26').replace(/\|/g, '%7C');

        try {
            const response = await fetch(`http://127.0.0.1:8000/meal/meal/food-search/?search_expression=${escapedSearchExpression}/`, {
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
                setSearchExpression('');

                if(data.length===0){
                    setMes("No food is found. Please search with different word.")
                }else{
                    setMes('')
                }
            } else {
                console.error('Failed to Food Search:', response.statusText);
            }
        } catch (error) {
            console.error('Error food search:', error.message);
        }
    };





    const handleFoodClick = async (foodData) => {
        try {
            // バックエンドに対して選択された食品データを送信
            const response = await fetch('http://127.0.0.1:8000/meal/meal/create-with-fatsecret/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ 'food_data': foodData ,'meal_data': mealData}),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Meal created successfully:', data);
                
            } else {
                console.error('Failed to create Meal:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating Meal:', error.message);
        }
    };





    return (
        <div>
            <Navigation />
        <input
            type="text"
            placeholder="Enter food name"
            value={searchExpression}
            onChange={(e) => setSearchExpression(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <ul>
            {searchResults.map((result) => (
                <li key={result.food_id} onClick={() => handleFoodClick(result)}>
                    {result.name}
                </li>
            ))}
        </ul>
        <p>{mes}</p>
        </div>
    );
};

export default FoodSearch;

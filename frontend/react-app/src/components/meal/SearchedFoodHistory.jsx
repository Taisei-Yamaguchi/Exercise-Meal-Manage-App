import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import getCookie from '../helpers/getCookie';
// import LogoutButton from './LogoutButton';


const SearchedFoodHistory = () => {
    const [foods, setFoods] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } else {
            fetchFoods(); // トークンを使用して食事情報を取得
        }
    }, []);
    

    // API経由でログインユーザーのmealを取得
    const fetchFoods = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/meal/food/get-searched-food-history/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setFoods(data.foods);
            console.log(data)
        } catch (error) {
            console.error('Error fetching searched food history.:', error);
        }
    };


    return (
        <div>
            <Navigation />
            <h1>Searched Fodd List</h1>
            

            <div>
                {foods.map((food, index) => (
                    <div className={`each-meal ${food.id}`} key={index}>
                        <p>Name: {food.name}</p>
                        <p>Cal: {food.cal} cal</p>
                        <p>Amount Per Serving: {food.amount_per_serving}</p>
                        <p>Carbohydrate: {food.carbohydrate} g</p>
                        <p>Fat: {food.fat} g</p>
                        <p>Protein: {food.protein} g</p>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchedFoodHistory;

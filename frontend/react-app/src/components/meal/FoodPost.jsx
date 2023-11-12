import React, { useState } from 'react';
import { useEffect } from 'react';


const FoodForm = () => {
    const [name, setName] = useState('');
    const [cal, setCal] = useState('');
    const [amount_per_serving,setAmount_per_servnig] =useState('');
    const [carbohydrate,setCarbohydrate] =useState('');
    const [fat,setFat] =useState('');
    const [protein,setProtein] =useState('');
    
    
    useEffect(() => {
        const yourAuthToken = localStorage.getItem('authToken'); // localStorage や state からトークンを取得する
        if (!yourAuthToken) {
            console.log('Token Error')
            navigate('../accounts/login'); // トークンがない場合はログインページにリダイレクト
        } 
    }, []);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }


    const handlePostFood = async () => {
        const yourAuthToken = localStorage.getItem('authToken'); 
        const FoodCredentias ={
            name:name,
            cal:cal,
            amount_per_serving: amount_per_serving,
            carbohydrate: carbohydrate,
            fat: fat,
            protein: protein,
        }

        try {
            const response = await fetch('http://127.0.0.1:8000//meal/food/post/',{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Token ${yourAuthToken}`, // トークンを設定
                    'X-CSRFToken': getCookie('csrftoken') ,
                },
                body: JSON.stringify(FoodCredentias)
            });

            if (response.ok) {
                // ログイン成功時の処理
                console.log('Food posted successfully:', response.data);
            } else {
                // ログイン失敗時の処理
                console.log(response.json());
            }

        } catch (error) {
            console.error('Failed to post food:', error);
        }
    };



    return (
        <div>
            <div className='food-form'>
                <label>Name:<input type="text" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label>Cal (kcal):<input type="number" value={cal} onChange={(e) => setCal(e.target.value)} /></label>
                <label>Amount per serving (g):<input type="number" value={amount_per_serving} onChange={(e) => setAmount_per_servnig(e.target.value)} /></label>
                <label>Carbohydrate (g):<input type="number" value={carbohydrate} onChange={(e) => setCarbohydrate(e.target.value)} /></label>
                <label>Fat (g):<input type="number" value={fat} onChange={(e) => setFat(e.target.value)} /></label>
                <label>Protein (g):<input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} /></label>
                <button onClick={handlePostFood}>Post Food</button>
            </div>
        </div>
    );
};

export default FoodForm;

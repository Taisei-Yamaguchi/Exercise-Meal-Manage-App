import React, { useState } from 'react';
import Navigation from '../Navigation';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';
import MealNavigation from './meal-nav/MealNavigation';

const FoodCreate = () => {
    
    const [name, setName] = useState('');
    const [cal, setCal] = useState('');
    const [amount_per_serving,setAmount_per_servnig] =useState('');
    const [carbohydrate,setCarbohydrate] =useState('');
    const [fat,setFat] =useState('');
    const [protein,setProtein] =useState('');
    
    
    useAuthCheck()

    const handlePostFood = async (e) => {
        e.preventDefault()
        if(carbohydrate===''){
            setCarbohydrate(null)
        }
        if(fat===''){
            setFat(null)
        }
        if(protein===''){
            setProtein(null)
        }

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
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
                <MealNavigation/>
                
                <form className='food-form main' onSubmit={handlePostFood}>
                    <label>Name:<input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                        pattern="\S+" // スペース以外の文字が1文字以上必要
                        title="スペースのみの入力は無効です"/>(必須)</label>
                    <label>Cal (kcal):<input type="number" value={cal} onChange={(e) => setCal(e.target.value)} required min={1}/>(必須)</label>
                    <label>Amount per serving (g):<input type="number" value={amount_per_serving} onChange={(e) => setAmount_per_servnig(e.target.value)} required min={1}/>(必須)</label>
                    <label>Carbohydrate (g):<input type="number" value={carbohydrate} onChange={(e) => setCarbohydrate(e.target.value)}min={0}/></label>
                    <label>Fat (g):<input type="number" value={fat} onChange={(e) => setFat(e.target.value)} min={0}/></label>
                    <label>Protein (g):<input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} min={0}/></label>
                    <button type="submit">Post Food</button>
                </form>
                
                
            </div>
        </div>
    );
};

export default FoodCreate;

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

        <div className="card shrink-0 w-full max-w-sm shadow-2xl text-slate-400" onSubmit={handlePostFood}>
        <form className="card-body">

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Name (必須)</span>
                </label>
                <input
                    type="text" 
                    placeholder="Name" 
                    className="input input-bordered"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    pattern="\S+" // スペース以外の文字が1文字以上必要
                    title="スペースのみの入力は無効です" />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Cal (kcal) (必須)</span>
                </label>
                <input 
                    type="number" 
                    value={cal} onChange={(e) => setCal(e.target.value)} 
                    required 
                    min={1}
                    placeholder="Cal" className="input input-bordered"     
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Amout (g/serving) (必須)</span>
                </label>
                <input 
                    type="number" 
                    value={amount_per_serving} 
                    onChange={(e) => setAmount_per_servnig(e.target.value)} 
                    required 
                    min={1}
                    placeholder="Amount" className="input input-bordered"     
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Carbohydrate (g) (必須)</span>
                </label>
                <input 
                    type="number" 
                    value={carbohydrate} 
                    onChange={(e) => setCarbohydrate(e.target.value)} 
                    required 
                    min={0}
                    placeholder="Carbohydrate" className="input input-bordered"     
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Fat (g) (必須)</span>
                </label>
                <input 
                    type="number" 
                    value={fat} 
                    onChange={(e) => setFat(e.target.value)} 
                    required
                    min={0}
                    placeholder="Fat" className="input input-bordered"     
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Protein (g) (必須)</span>
                </label>
                <input 
                    type="number" 
                    value={protein} 
                    onChange={(e) => setProtein(e.target.value)} 
                    required 
                    min={0}
                    placeholder="Protein" className="input input-bordered"     
                />
            </div>

            <div className="form-control mt-6">
            <button className="btn btn-primary" type='submit'>Create Food</button>
            </div>
        </form>
    </div>


            
    );
};

export default FoodCreate;

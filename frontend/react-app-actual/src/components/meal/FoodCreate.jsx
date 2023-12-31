import React, { useState } from 'react';
import getCookie from '../../helpers/getCookie';

import { BACKEND_ENDPOINT } from '../../settings';

import { useDispatch } from 'react-redux';
import { setToastMes } from '../../redux/store/ToastSlice';
import { setToastClass } from '../../redux/store/ToastSlice';
import { setFoodLoading } from '../../redux/store/LoadingSlice';
import { setModalLoading } from '../../redux/store/LoadingSlice';
import { useSelector } from 'react-redux/es/hooks/useSelector';

const FoodCreate = () => {
    const [name, setName] = useState('');
    const [cal, setCal] = useState('');
    const [amount_per_serving,setAmount_per_servnig] =useState('');
    const [carbohydrate,setCarbohydrate] =useState('');
    const [fat,setFat] =useState('');
    const [protein,setProtein] =useState('');
    const dispatch =useDispatch()
    const modalLoading =useSelector((state)=> state.loading.modalLoading);
    const clearForm =()=>{
        setName('')
        setCal('')
        setAmount_per_servnig('')
        setCarbohydrate('')
        setFat('')
        setProtein('')
    }


    // create food
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

        const FoodCredentias ={
            name:name,
            cal:cal,
            amount_per_serving: amount_per_serving,
            carbohydrate: carbohydrate,
            fat: fat,
            protein: protein,
        }

        try {
            dispatch(setModalLoading(false))
            dispatch(setToastMes(''))
            dispatch(setFoodLoading(true))

            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/meal/food/post/`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Token ${authToken}`, // トークンを設定
                    'X-CSRFToken': getCookie('csrftoken') ,
                },
                body: JSON.stringify(FoodCredentias)
            });

            if (response.ok) {
                dispatch(setToastMes('Created Food Successfully!'))
                dispatch(setToastClass('alert-info'))
                clearForm()
            } else {
                console.log(response.json());
                dispatch(setToastMes('Error'))
                dispatch(setToastClass('alert-error'))
            }

        } catch (error) {
            console.error('Failed to post food:', error);
            dispatch(setToastMes('Error'))
            dispatch(setToastClass('alert-error'))
        } finally{
            dispatch(setModalLoading(false))
            dispatch(setFoodLoading(false))
        }
    };



    // render
    return (
        <div className="card shrink-0 w-full max-w-sm shadow-2xl text-slate-700" onSubmit={handlePostFood}>
        
        {modalLoading ?(
                <span className="loading loading-dots loading-lg"></span>
            ):(
        <form className="card-body">
            
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Name <span className='bg-red-500 text-white text-xs'>necessary</span></span>
                </label>
                <input
                    type="text" 
                    placeholder="Name" 
                    className="input input-bordered"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                    pattern=".*\S+.*"
                    title="You cannot input with only space." />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Cal (kcal) <span className='bg-red-500 text-white text-xs'>necessary</span></span>
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
                    <span className="label-text">Amount (g/serving) <span className='bg-red-500 text-white text-xs'>necessary</span></span>
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
                    <span className="label-text">Carbohydrate (g) <span className='bg-red-500 text-white text-xs'>necessary</span></span>
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
                    <span className="label-text">Fat (g) <span className='bg-red-500 text-white text-xs'>necessary</span></span>
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
                    <span className="label-text">Protein (g) <span className='bg-red-500 text-white text-xs'>necessary</span></span>
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
        )}
    </div>
    );
};

export default FoodCreate;

import React, { useState } from 'react';
import getCookie from '../../hooks/getCookie';
import useAuthCheck from '../../hooks/useAuthCheck';
// import { authToken } from '../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../settings';

const FoodSearch = ({meal_type,date,onUpdate}) => {
    // const {meal_type,date}=useParams();
    const [searchExpression, setSearchExpression] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const mealData ={
        'meal_date':date,
        'serving':1,
        'meal_type':meal_type,
    }
    const [mes,setMes] = useState('')

    useAuthCheck()

    const handleSearch = async (e) => {
        e.preventDefault();
        const escapedSearchExpression = searchExpression.replace(/&/g, '%26').replace(/\|/g, '%7C');
        
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/meal/meal/food-search/?search_expression=${escapedSearchExpression}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                // console.log('Food Search successfully:', data);
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
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/meal/meal/create-with-fatsecret/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authToken}`,
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ 'food_data': foodData ,'meal_data': mealData}),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Meal created successfully:', data);
                onUpdate();
                
            } else {
                console.error('Failed to create Meal:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating Meal:', error.message);
        }
    };


    return (
        <div className='food-search'>
            <h2>You can use <strong>&</strong> , <strong>|</strong> search.</h2>
            <form onSubmit={handleSearch}>
            <div className="join">
                <div className='insicator'>
                    <input 
                        className="input input-bordered join-item max-sm:input-sm" 
                        type="text"
                        placeholder="Enter food name"
                        value={searchExpression}
                        onChange={(e) => setSearchExpression(e.target.value)}
                        required
                        pattern="\S+" // スペース以外の文字が1文字以上必要
                        title="スペースのみの入力は無効です"
                    />
                </div>
                <div className="indicator">
                    <button type='submit' className="btn bg-green-200 join-item max-sm:btn-sm">Search</button>
                </div>
            </div>
            </form>

            {mes ==='' ?(
                    <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        {/* head */}
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Cals</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchResults.map((result) =>(
                            <tr key={result.food_id}>
                                <th><button className='btn btn-xs btn-accent' onClick={() => handleFoodClick(result)}>Add</button>
                                </th>
                                <td>{result.name}</td>
                                <td>
                                    {Math.round(result.cal)} kcal<br></br>
                                        {result.is_100g==true && result.is_serving==false ?(
                                            <>(100g/1Per)</>
                                        ):(
                                            <>(1Per)</>
                                    )}    
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                ):(
                    <div role="alert" className="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>{mes}</span>
                    </div>
                )}
        </div>
    );
};

export default FoodSearch;

import React, { useState, useEffect } from 'react';
import getCookie from '../../../hooks/getCookie';
import { NavLink } from 'react-router-dom';


const PFCByDate = ({ selectedDate,onUpdate}) => {
    
    const [pfcData, setPfcData] = useState([]);
    
    
    useEffect(() => {
        fetchData()
    }, [selectedDate,onUpdate]);
    // API経由でログインユーザーのpfcを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/main/pfc-by-date/?date=${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setPfcData(data);
            console.log('pfc',data)
        } catch (error) {
            console.error('Error fetching data.:', error);
        }
    };
    
    

    return (
        <div>
            
            <ul className='daily-pfc'>
                {pfcData.map((item, index) => (
                    <li key={index}>
                        {item.nutrient[0].toUpperCase()} {Math.round(item.amount)}g
                    </li>
                ))}
                <NavLink to={`/meal/nutrients-graph/${selectedDate}`}>More</NavLink>
            </ul>
            
        </div>
        );
        
};

export default PFCByDate;

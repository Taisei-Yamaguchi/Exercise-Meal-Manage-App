import React, { useState, useEffect } from 'react';
import getCookie from '../../../hooks/getCookie';
import { NavLink } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';



const PFCByDate = ({ selectedDate,onUpdate}) => {
    
    const [pfcData, setPfcData] = useState([]);
    const [totalAmount,setTotalAmount] =useState(0);

    useEffect(()=>{
        setTotalAmount(pfcData.reduce((total, item) => total + item.amount, 0));
    },[pfcData])
    
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

    
    const pieChartData = {
        labels: false,
        datasets: [{
            data: pfcData.map((item) => Math.round(item.amount)),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // You can customize the colors
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },],
    };


    const getColor = (index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56']; // ご希望の色を追加または変更
        return colors[index % colors.length];
    };
    
    return (
        <div className='flex flex-col text-sm'>       
            <ul className='flex justify-between'>
                {pfcData.map((item, index) => (
                    <li key={index} style={{backgroundColor: getColor(index), width:50}}>
                        <p>{item.nutrient[0].toUpperCase()} {Math.round(item.amount)}g</p>
                    </li>
                ))}
                <NavLink to={`/meal/nutrients-graph/${selectedDate}`}>More</NavLink>
                {/* <div style={{ width: '150px', height: '150px' }}>
                    <div style={{ width: '100%', height: '30px', backgroundColor: '#ddd', marginTop: '10px' }}>
                    </div>
                </div> */}
            </ul>

            
            <div className='skeleton' style={{ width: '100%', height: '30px', marginTop: '10px', position: 'relative' }}>
                {totalAmount > 0 &&pfcData.map((item, index) => (
                <React.Fragment key={index}>
                    <div
                    style={{
                        width: `${(item.amount / totalAmount) * 100}%`,
                        height: '100%',
                        backgroundColor: getColor(index),
                        display: 'inline-block',
                        position: 'absolute',
                        top: 0,
                        left: `${pfcData.slice(0, index).reduce((acc, i) => acc + (i.amount / totalAmount) * 100, 0)}%`,
                        marginBottom: '2px', // 適切な間隔を確保
                        
                    }}
                    className='flex justify-center items-center'
                    >

                        <div className='justify-self-center'>{Math.round(item.amount/totalAmount*100)} % </div>
                    
                    </div>
                </React.Fragment>
                ))}
            </div> 
        </div> 
        );
        
};

export default PFCByDate;

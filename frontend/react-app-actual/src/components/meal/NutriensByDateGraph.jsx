import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../hooks/getCookie';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../Navigation';
import MealNavigation from './meal-nav/MealNavigation';
import { useParams } from 'react-router-dom';

const DailyNutrientsGraph = () => {
    const [nutrientstData, setNutrientsData] = useState([]);
    const [error, setError] = useState(null);
    const { date } = useParams();
    const chartRef = useRef(null); // チャートの参照

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/graph/daily-nutrients-graph/?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken'),
            },
            });

            if (!response.ok) {
            throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setNutrientsData(data);
            console.log(data)

            // Chartを破棄
            if (chartRef.current) {
            chartRef.current.destroy();
            }

            // Chartを再描画
            const newChart = new Chart(chartRef.current, {
            type: 'line',
            data: data,
            options: options,
            });
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません

    // Check if data is not yet fetched
    if (!nutrientstData.length) {
        return (
        <div>
            <Navigation />
            <MealNavigation />
            <p>Loading...</p>
        </div>
        )
    }

    // // // ラベルとデータを用意
    const labels = nutrientstData.map(entry => entry.nutrient);
    const dailyNutrients = nutrientstData.map(entry => entry.amount);

     // Chart.js data
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Daily Nutrient',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.6)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: dailyNutrients,
        },
        ],
    };

    const options = {
        indexAxis: 'y', // y軸を使用して横向きに表示
        
    };

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container'>
                <MealNavigation />
                <div className='main graph'>
                    {/* <h1>Daily Nutrients Graph</h1> */}
                    <canvas ref={chartRef} />
                    <Bar data={data} height={300} options={options}/>
                </div>
            </div>
        </div>
    );
};

export default DailyNutrientsGraph;

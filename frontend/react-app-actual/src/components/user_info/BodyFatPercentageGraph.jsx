import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../hooks/getCookie';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../Navigation';
import UserInfoNavigation from './user_info-nav/UserInfoNavigation';

const BodyFatPercentageGraph = () => {
    const [bodyFatData, setBodyFatData] = useState([]);
    const [latestTargetBodyFat, setLatestTargetBodyFat] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // チャートの参照

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/graph/body_fat_percentage-graph/', {
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
            setBodyFatData(data.body_fat_data);
            setLatestTargetBodyFat(data.latest_body_fat_target);
            console.log(data.body_fat_data);
            console.log(data.latest_body_fat_target);

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

    // ラベルとデータを用意
    const labels = bodyFatData.map(entry => entry.date);
    const body_fat_percentages = bodyFatData.map(entry => entry.body_fat_percentage);

    // 直前のデータを使って null を補完する
    for (let i = 1; i < body_fat_percentages.length; i++) {
        if (body_fat_percentages[i] === null) {
            body_fat_percentages[i] = body_fat_percentages[i - 1];
        }
    }

    // Chart.jsのデータ構造
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Body Fat Percentage',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: body_fat_percentages,
        },
        {
            type: 'line',
            label: 'Target Weight',
            fill: false,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderDash: [5, 5], // 破線
            data: Array(labels.length).fill(latestTargetBodyFat),
            showLine: true, // プロットなしで直線を描画
            pointRadius: 0, // プロットを非表示
        },
        ],
    };

    const options = {
        scales: {
        x: {
            type: 'category',
            labels: labels,
        },
        y: {
            beginAtZero: true, // y軸を0から始めない
            min: 0,
            max: 30, // y軸の最大値
            stepSize: 5,
            
        },
        },
    };

    return (
        <div className='container'>
            <Navigation />
            <div className='sub-container user-info-main-container'>
                <UserInfoNavigation />
                <h1>Body Fat Graph</h1>
                <canvas ref={chartRef} />
                <Line data={data} options={options} height={400}/>
            </div>
        </div>
    );
};

export default BodyFatPercentageGraph;

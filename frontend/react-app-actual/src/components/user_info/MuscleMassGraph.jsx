import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../hooks/getCookie';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../Navigation';
import UserInfoNavigation from './user_info-nav/UserInfoNavigation';

const MuscleMassGraph = () => {
    const [muscleMassData, setMuscleMassData] = useState([]);
    const [targetMuscleMass,setTargetMuscleMass] =useState([]);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // チャートの参照
    const [graphWidth, setGraphWidth] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/graph/muscle_mass-graph/', {
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
            setMuscleMassData(data.muscle_mass_data);
            setTargetMuscleMass(data.latest_muscle_mass_target);
            console.log(data.muscle_mass_data);
            console.log(data.latest_muscle_mass_target);
            
            const xAxisLabelMinWidth = 20; // データ当たりの幅を設定
            const width = data.muscle_mass_data.length * xAxisLabelMinWidth;
            setGraphWidth(width);


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
    const labels = muscleMassData.map(entry => entry.date);
    const muscle_masses = muscleMassData.map(entry => entry.muscle_mass);

    // 直前のデータを使って null を補完する
    for (let i = 1; i < muscle_masses.length; i++) {
        if (muscle_masses[i] === null) {
            muscle_masses[i] = muscle_masses[i - 1];
        }
    }

    // Chart.jsのデータ構造
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Muscle Mass',
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
            data: muscle_masses,
        },
        {
            type: 'line',
            label: 'Target Weight',
            fill: false,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderDash: [5, 5], // 破線
            data: Array(labels.length).fill(targetMuscleMass),
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
            max: 100, // y軸の最大値
            stepSize: 5,
            position: 'right',

            title: {
                display: true,
                text: '(kg)', // y軸のタイトルに単位を追加
                color: 'black', // タイトルの色
                font: {
                    weight: 'bold', // タイトルの太さ
                    size: 12, // タイトルのサイズ
                },
            },
        },
        },
    };

    return (
        <div className='container'>
            <div className='sub-container'>
                <UserInfoNavigation />
                <div className='flex main graph-container border overflow-x-auto ml-px pl-px'>
                    <canvas ref={chartRef} />
                    {graphWidth && 
                        <Line 
                            data={data} 
                            options={options} 
                            height={400} 
                            width={graphWidth}
                            className='border'
                        />
                    }
                </div>
                
            </div>
        </div>
    );
};

export default MuscleMassGraph;

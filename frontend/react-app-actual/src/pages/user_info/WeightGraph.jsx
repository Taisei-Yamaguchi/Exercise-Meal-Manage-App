import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../helpers/getCookie';
import { Line } from 'react-chartjs-2';
import UserInfoNavigation from '../../components/user_info/user_info-nav/UserInfoNavigation';
import { BACKEND_ENDPOINT } from '../../settings';
import useAuthCheck from '../../helpers/useAuthCheck';

const WeightGraph = () => {
    const [weightData, setWeightData] = useState([]);
    const [goalWeight, setGoalWeight] = useState(null);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // チャートの参照
    const [graphWidth, setGraphWidth] = useState(null);

    useAuthCheck()

    //fetch Data first render.
    useEffect(()=>{
        fetchData()
    },[])

    
    // fetch Data
    const fetchData = async () => {
        console.log(BACKEND_ENDPOINT);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_ENDPOINT}/graph/weight-graph/`, {
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
            setWeightData(data.weight_data);
            setGoalWeight(data.goal_weight);
            // console.log(data.latest_target_weight);
            console.log(data.weight_data);

            const xAxisLabelMinWidth = 30; // データ当たりの幅を設定
            const width = data.weight_data.length * xAxisLabelMinWidth;
            setGraphWidth(width);

            // Chartを破棄
            if (chartRef.current) {
                chartRef.current.destroy();
            }

        } catch (error) {
            setError('An error occurred while fetching data.');
        }
    };

    

    // ラベルとデータを用意
    const labels = weightData.map(entry => entry.date);
    const weights = weightData.map(entry => entry.weight);

    // 直前のデータを使って null を補完する
    for (let i = 1; i < weights.length; i++) {
        if (weights[i] === null) {
            weights[i] = weights[i - 1];
        }
    }

    // chart data
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Weight',
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
            data: weights,
        },
        {
            type: 'line',
            label: 'Goal Weight',
            fill: false,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderDash: [5, 5], // 破線
            data: Array(labels.length).fill(goalWeight),
            showLine: true, // プロットなしで直線を描画
            pointRadius: 0, // プロットを非表示
        },
        ],
    };

    // cart option
    const options = {
        scales: {
            x: {
                type: 'category',
                labels: labels,
            },
            y: {
                beginAtZero: true, // y軸を0から始めない
                min: 0,
                max: 150, // y軸の最大値
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
        layout: {
            padding: {
                left: 0, // 左側の余白を調整
                right: 0,
                top: 0,
                bottom: 0,
            },
            margin:{
                left:0,
            }
        },
        responsive: false,
    };


    // render
    return (
        <div className='container'>
            <div className='sub-container flex justify-center'>
                <UserInfoNavigation />
                <div className='graph-container'>
                <h2>Weight (kg)</h2>
                <div className='flex  border overflow-x-auto ml-px pl-px'>
                    {/* <canvas ref={chartRef} /> */}
                    {graphWidth && 
                        <Line 
                            data={data} 
                            options={options} 
                            height={450} 
                            width={graphWidth}
                            className='border'
                        />
                    }
                </div>
                </div>
            </div>
        </div>
    );
};

export default WeightGraph;

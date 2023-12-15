import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../hooks/getCookie';
import { Bar } from 'react-chartjs-2';
import UserInfoNavigation from '../components/user_info/user_info-nav/UserInfoNavigation';
// import { authToken } from '../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../settings';

const CalsGraph = () => {
    const [intakeCals, setIntakeCals] = useState([]);
    const [consumingCals, setConsumingCals] =useState([]);
    const [error, setError] = useState(null);
    const [graphWidth, setGraphWidth] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
        
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/graph/cals-graph/`, {
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
            setIntakeCals(data.intake_cals);
            setConsumingCals(data.consuming_cals);
            // console.log(data.consuming_cals.length)

            const xAxisLabelMinWidth = 24; // データ当たりの幅を設定
            const width = data.consuming_cals.length * xAxisLabelMinWidth;
            setGraphWidth(width);
            
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); 
    


    // グラフの横幅を計算
    const data = {
        labels: consumingCals.map(entry => entry.date),
        datasets: [
            {
                label: 'Intake Calories',
                type: 'line',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: intakeCals.map(entry => entry.total_cal),
                fill: false,
            },
            {
                label: 'BM Calories',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                data: consumingCals.map(entry => entry.bm_consuming_cal),
                
                categoryPercentage: 1, // カテゴリー全体の幅に対するバーの幅の割合
                barPercentage: 1, // データセット全体の幅に対するバーの幅の割合
                // barThickness: barThickness
        
            },
            {
                label: 'Exercise Calories',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                data: consumingCals.map(entry => entry.exercise_consuming_cals),
                
                categoryPercentage: 1, // カテゴリー全体の幅に対するバーの幅の割合
                barPercentage: 1, // データセット全体の幅に対するバーの幅の割合
                // barThickness: barThickness
        
            },
            
            {
                label: 'Food Calories',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                data: consumingCals.map(entry => entry.food_consuming_cal),
                
                categoryPercentage: 1, // カテゴリー全体の幅に対するバーの幅の割合
                barPercentage: 1, // データセット全体の幅に対するバーの幅の割合
                // barThickness: barThickness
        
            },
            
        ],
    };


    const options = {
        maintainAspectRatio: false, // アスペクト比を無効にする
        scales: {
            x: {
                stacked: true,
                
            },
            y: {
                stacked: true,
                position: 'right',
                title: {
                    display: true,
                    text: '(kcal)', // y軸のタイトルに単位を追加
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
        },
        responsive: false,
    };



    return (
        <div className='container'>
            <div className='sub-container flex justify-center'>
                <UserInfoNavigation />
                <div className='graph-container'>
                    <h2>Cals Transition</h2>
                    <div className="flex border overflow-x-auto ml-px pl-px">
                    {graphWidth&& 
                    <Bar
                        ref={chartRef}
                        data={data}
                        height={450}
                        width={graphWidth}
                        options={options}
                        className='border'
                    />
                    }
                </div>
                </div>
            </div>
        </div>
    );
};

export default CalsGraph;

import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../../hooks/getCookie';
import { Bar,Line } from 'react-chartjs-2';
import Navigation from '../Navigation';
import UserInfoNavigation from './user_info-nav/UserInfoNavigation';

const CalsGraph = () => {
    const [intakeCals, setIntakeCals] = useState([]);
    const [consumingCals, setConsumingCals] =useState([]);
    const [error, setError] = useState(null);
    const [graphWidth, setGraphWidth] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/graph/cals-graph/', {
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
            console.log(data.consuming_cals.length)

            const xAxisLabelMinWidth = 24; // データ当たりの幅を設定
            const width = data.consuming_cals.length * xAxisLabelMinWidth;
            setGraphWidth(width);
            
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません
    
    
    
    useEffect(()=>{
        console.log('width',graphWidth)
    },[graphWidth])


    // グラフの横幅を計算
    const barThickness = 20; // 一定の横バーの厚さ
    

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



    useEffect(() => {
        if (graphWidth && chartRef.current) {
            // グラフ描画後にスクロールを一番右に移動する
            console.log(chartRef.current)

            console.log(chartRef.current.scales['x'].max)
            
            chartRef.current.options.plugins.zoom = {
                pan: {
                    enabled: true,
                    mode: 'x',
                    rangeMin: {
                        x: null,
                    },
                    rangeMax: {
                        x: chartRef.current.scales['x'].max,
                    },
                },
            };
        
            // // グラフ描画後にスクロールを一番右に移動する
            // chartRef.current.options.plugins.zoom.pan({
            //      // x軸方向にスクロール（最大値を指定して一番右にスクロール）
            //     range: { x: { min: null, max: chartRef.current.scales['x'].max } },
            // });
            
        }
    }, [chartRef.current]);
    

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
        // width:graphWidth,
        
        // plugins: {
        //     zoom: {
        //         pan: {
        //             enabled: true,
        //             mode: 'x',
        //             rangeMin: {
        //             x: null,
        //             },
        //             rangeMax: {
        //             x: null,
        //             },
        //         },
        //     },
        // },
        
    };

// 適切な値を設定

    return (
        <div className='container'>
            <div className='sub-container flex justify-center'>
                <UserInfoNavigation />
                <div className="flex main graph-container border overflow-x-auto ml-px pl-px">
                    
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
    );
};

export default CalsGraph;

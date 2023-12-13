import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../hooks/getCookie';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';
import ExerciseNavigation from '../components/exercise/exercise-nav/ExerciseNavigation';
import useAuthCheck from '../hooks/useAuthCheck';

const DailyExerciseWeightGraph = () => {
    const [dailyExerciseWeightData, setDailyExerciseWeightData] = useState([]);
    const {workout_type} =useParams();
    const [error, setError] = useState(null);
    const workoutTypes = ['All','Chest', 'Back', 'Shoulder', 'Arm','Leg','Abs','Other'];
    const [graphWidth, setGraphWidth] = useState(null);
    // const chartRef = useRef(null); // チャートの参照

    useAuthCheck()

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch
            (`http://127.0.0.1:8000/graph/daily-total-weight-graph/?workout_type=${workout_type}`, 
            
            {
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
            setDailyExerciseWeightData(data);
            console.log(data)

            const xAxisLabelMinWidth = 24; // データ当たりの幅を設定
            const width = data.length * xAxisLabelMinWidth;
            setGraphWidth(width);
            

        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません

    // Check if data is not yet fetched
    if (!dailyExerciseWeightData.length) {
        return <p>Loading...</p>;
    }

    // // ラベルとデータを用意
    // Extracting labels and total weights from the data
    const labels = dailyExerciseWeightData.map(entry => entry.exercise_date);
    const weights = dailyExerciseWeightData.map(entry => entry.total_weight);

     // Chart.js data
    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Total Weight',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.6)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: weights,
        },
        ],
    };


    const option ={
        scales: {
            y: {
                position:'right',
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
        },
        responsive: false,
    }


    return (
        <div className='container'>
            <div className='sub-container flex justify-center'>
                <ExerciseNavigation />
                <div className='main'>
                    <div className='graph-head flex flex-col items-center '>
                        <h3>{workout_type}</h3>
                        <div className='flex flex-row justify-between  w-full border'>
                            {workoutTypes.map((type)=>(
                                <a key={type} href={type} className='link'>{type}</a>
                            ))}
                        </div>
                        
                    </div>
                        
                    <div className="flex border overflow-x-auto ml-px pl-px">
                        {graphWidth&&
                            <Bar data={data} height={300} options={option} width={graphWidth}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyExerciseWeightGraph;

import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../hooks/getCookie';
import { Bar } from 'react-chartjs-2';
import useAuthCheck from '../hooks/useAuthCheck';
import ExerciseNavigation from '../components/exercise/exercise-nav/ExerciseNavigation';
// import { authToken } from '../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../settings';

const ExerciseTotalWeightGraph = () => {
    const [totalWeightData, setTotalWeightData] = useState([]);
    const [grandWeight,setGrandWeight]= useState('')
    const [error, setError] = useState(null);
    // const chartRef = useRef(null); // チャートの参照

    useAuthCheck()

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_ENDPOINT}/graph/total-weight-graph/`, {
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
            setTotalWeightData(data.result_list);
            setGrandWeight(data.grand_total);
        
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません

    // Extracting labels and total weights from the data
    const labels = totalWeightData.map(entry => entry.workout__workout_type);
    const weights = totalWeightData.map(entry => entry.total_weight);

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
    }

    return (
        <div className='container'>
            <div className='sub-container'>
                <ExerciseNavigation />
                <div className='main'>
                    <h1>Total Weight Graph</h1>
                    <Bar data={data} height={200} options={option}/>
                    <h2>Grand Total Weight: {Math.round(grandWeight)/1000} (t)</h2>
                </div>
            </div>
        </div>
    );
};

export default ExerciseTotalWeightGraph;

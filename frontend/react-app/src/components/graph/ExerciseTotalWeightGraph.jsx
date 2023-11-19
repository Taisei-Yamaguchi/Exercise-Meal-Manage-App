import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../helpers/getCookie';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../Navigation';

const ExerciseTotalWeightGraph = () => {
    const [totalWeightData, setTotalWeightData] = useState([]);
    const [grandWeight,setGrandWeight]= useState('')
    const [error, setError] = useState(null);
    // const chartRef = useRef(null); // チャートの参照

    useEffect(() => {
        const fetchData = async () => {
        console.log('start fetch');
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://127.0.0.1:8000/graph/total-weight-graph/', {
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

            // // Chartを破棄
            // if (chartRef.current) {
            // chartRef.current.destroy();
            // }

            // Chartを再描画
            // const newChart = new Chart(chartRef.current, {
            // type: 'line',
            // data: data,
            // options: options,
            // });
        } catch (error) {
            setError('An error occurred while fetching data.');
        }
        };

        fetchData();
    }, []); // 依存する変数はありません

    // Check if data is not yet fetched
    if (!totalWeightData.length) {
        return <p>Loading...</p>;
    }

    // // ラベルとデータを用意
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

    return (
        <div>
            <Navigation />
            <h1>Total Weight Graph</h1>
            <Bar data={data} height={300}/>
            <h2>Grand Total Weight: {grandWeight} (kg)</h2>
        </div>
    );
};

export default ExerciseTotalWeightGraph;

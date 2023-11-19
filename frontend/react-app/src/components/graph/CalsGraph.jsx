import React, { useState, useEffect, useRef } from 'react';
import getCookie from '../helpers/getCookie';
import { Bar,Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Navigation from '../Navigation';

const CalsGraph = () => {
    const [intakeCals, setIntakeCals] = useState([]);
    const [consumingCals, setConsumingCals] =useState([]);
    const [error, setError] = useState(null);
    // const chartRef = useRef(null); // チャートの参照

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
            console.log(data.intake_cals);
            console.log(data.consuming_cals);
            console.log(data)

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
    // if (!calsData.length) {
    //     return <p>Loading...</p>;
    // }

    // // // ラベルとデータを用意
    // // Extracting labels and cals from the data
    // const labels =  consumingCals.map(entry => entry.date);
    // const bm_cals = consumingCals.map(entry => entry.bm_consuming_cal);

    //  // Chart.js data
    // const data = {
    //     labels: labels,
    //     datasets: [
    //     {
    //         label: 'Cals',
    //         backgroundColor: 'rgba(75,192,192,0.4)',
    //         borderColor: 'rgba(75,192,192,1)',
    //         borderWidth: 1,
    //         hoverBackgroundColor: 'rgba(75,192,192,0.6)',
    //         hoverBorderColor: 'rgba(75,192,192,1)',
    //         data: bm_cals,
    //     },
    //     ],
    // };
    

    const data = {
        labels: consumingCals.map(entry => entry.date),
        datasets: [
            {
                label: 'Exercise Calories',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                data: consumingCals.map(entry => entry.exercise_consuming_cals),
            },
            {
                label: 'BM Calories',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                data: consumingCals.map(entry => entry.bm_consuming_cal),
            },
            {
                label: 'Food Calories',
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                data: consumingCals.map(entry => entry.food_consuming_cal),
            },
            {
                label: 'Intake Calories',
                type: 'line',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: intakeCals.map(entry => entry.total_cal),
                fill: false,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    return (
        <div>
            <Navigation />
            <h1>Cals Graph</h1>
            <Bar data={data} height={300} options={options}/>
            
        </div>
    );
};

export default CalsGraph;

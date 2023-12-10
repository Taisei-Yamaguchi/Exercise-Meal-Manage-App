import React, { useState, useEffect } from 'react';
import getCookie from '../../../hooks/getCookie';
import { Bar } from 'react-chartjs-2';



const CalsByDate = ({ selectedDate,onUpdate}) => {
    
    const [calsData, setCalsData] = useState([]);
    const [totalConsumedCals,setTotalConsume] =useState(0);
    const [totalCals,setTotalCal]= useState(0);
    const [aspectRatio, setAspectRatio] = useState(3);


    useEffect(()=>(
        setTotalConsume(calsData.bm_cals + calsData.exercise_cals + calsData.food_cals),
        setTotalCal(Math.max(totalConsumedCals, calsData.intake_cals))
    ),[calsData])
    
    useEffect(() => {
        
        fetchData()
    }, [selectedDate,onUpdate]);

useEffect(()=>{
    handleWindowResize(); // 初回描画時にも実行
    window.addEventListener('resize', handleWindowResize);

    return () => {
        window.removeEventListener('resize', handleWindowResize);
    };
})

    

    // API経由でログインユーザーのpfcを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://127.0.0.1:8000/main/cals-by-date/?date=${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setCalsData(data);
            console.log('cals',data)
        } catch (error) {
            console.error('Error fetching data.:', error);
        }
    };

    

    const handleWindowResize = () => {
        // Windowのサイズに基づいてaspectRatioを計算する

        
        const width = window.innerWidth;
        if(width<=400){
            setAspectRatio(2)
        }
        else if (width <= 510) {
            setAspectRatio(3)
        } else if (width <= 600) {
            setAspectRatio(4)
        } else if (width <= 700) {
            setAspectRatio(5)
        } else {
            setAspectRatio(6)
        }
        
        console.log('New Aspect Ratio:', );

        
    };


    const chartData = {
        labels: ' ',
        datasets: [
            
            {
                label: '目標最低摂取',
                type: 'line',
                borderColor: 'blue',
                pointBackgroundColor: 'blue', // ドットの内側の色を設定
                pointRadius: 5, // ドットのサイズを設定
                data: [
                    calsData.bm_cals
                    
                ],
                fill: false,
            },
            {
                label: '目標消費cal',
                type: 'line',
                borderColor: 'red',
                pointBackgroundColor: 'red', // ドットの内側の色を設定
                pointRadius: 5, // ドットのサイズを設定
                data: [
                    calsData.food_cals+250
                ],
                fill: false,
            },
            {
                label: 'Intake Cals',
                data: [calsData.intake_cals],
                backgroundColor: '#a2ecc5',
                barThickness: 40,
                
                stack: 'stack1', // 同じスタック名を指定することでスタックする
            },
            {
                label: '基礎代謝量',
                data: [calsData.bm_cals],
                backgroundColor: '#FF33CC',
                stack: 'stack2',
                barThickness: 40
            },
            {
                label: '食事誘発熱生産',
                data: [calsData.food_cals],
                backgroundColor: '#FF9966',
                stack: 'stack2',
                barThickness: 40
            },
            {
                label: '活動量',
                data: [calsData.exercise_cals],
                backgroundColor: '#FF6633',
                stack: 'stack2',
                barThickness: 40
            },
        ],
    };
    
    
    
    const chartOptions = {
        aspectRatio: aspectRatio, // 適切なアスペクト比を調整

        indexAxis: 'y',
        scales: {
            x: {
                stacked:true,
                max: calsData.bm_cals + 2000,
                beginAtZero: true,
                
            },
            y: {
                stacked: true,
            },
        },
        
    };
    

    return (
        <div className='h-38 cals-box'>
            {/* <ul className='flex'>
                <li>摂 {Math.round(calsData.intake_cals)}kcal</li>
                <li>消 {Math.round(calsData.bm_cals+calsData.exercise_cals+calsData.food_cals)}kcal (Exercise:{Math.round(calsData.exercise_cals)}kcal)</li>
            </ul> */}
            <div className=' border-solid'>
                <Bar key={aspectRatio} data={chartData} options={chartOptions} />
            </div>
            <div className="text-xs">
                <p >*基礎代謝量ぶんは最低限食べましょう！</p>
                <p>*活動量は250kcalを超えるぐらいが健康的だそうです</p>
            </div>
        </div>
        );
        
};

export default CalsByDate;

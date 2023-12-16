import React, { useState, useEffect } from 'react';
import getCookie from '../../../hooks/getCookie';
// import { NavLink } from 'react-router-dom';
import 'chartjs-plugin-datalabels';
// import { authToken } from '../../../helpers/getAuthToken';
import { BACKEND_ENDPOINT } from '../../../settings';
// import { useDispatch } from 'react-redux';
// import { setMealLoading } from '../../../redux/store/LoadingSlice';
import { useSelector } from 'react-redux';

const PFCByDate = ({ selectedDate}) => {
    // const dispatch =useDispatch()    
    const [pfcData, setPfcData] = useState([]);
    const [totalAmount,setTotalAmount] =useState(0);
    const [ratioPFC,setRatioPFC] = useState([]);
    const [mes,setMes] = useState('');
    const [mesClass,setMesClass] =useState('');
    const mealLoading = useSelector((state) => state.loading.mealLoading)


    useEffect(()=>{
        setTotalAmount(pfcData.reduce((total, item) => total + item.amount, 0));
    },[pfcData])
    
    // set Ratio
    useEffect(()=>{
        if(totalAmount > 0 ){
            const newRatioPFC = pfcData.map((item) => ({
                nutrient: item.nutrient,
                ratio: Math.round((item.amount / totalAmount) * 100),
            }));
            setRatioPFC(newRatioPFC);
            // console.log('ratio',newRatioPFC)
        }
    },[pfcData,totalAmount])


    // メッセージ　depending on ratioPFC
    useEffect(()=>{
        if (ratioPFC.length > 0) {
            const proteinRatio = ratioPFC.find(
                (item) => item.nutrient === 'protein'
            )?.ratio;
            const fatRatio = ratioPFC.find((item) => item.nutrient === 'fat')?.ratio;
            const carbRatio = ratioPFC.find((item) => item.nutrient === 'carbohydrate')?.ratio;

            let message = '';
            let messageClass = '';

            if (proteinRatio && proteinRatio <= 15) {
                message = 'Protein deficiency!';
                messageClass = 'btn-warning';
            } else if (fatRatio && fatRatio <= 15) {
                message = 'Fat deficiency!';
                messageClass = 'btn-warning';
            } else if (carbRatio && carbRatio <= 40) {
                message = 'Carb deficiency!';
                messageClass = 'btn-warning';
            } else if (
                proteinRatio >= 15 &&
                proteinRatio <= 30 &&
                fatRatio >= 15 &&
                fatRatio <= 30 &&
                carbRatio >= 50 &&
                carbRatio <= 60
            ) {
                message = 'Well-balanced!';
                messageClass = 'btn-success';
            }else{
                message=''
            }

            // console.log('mes',message)

            setMes(message);
            setMesClass(messageClass);
        }
    },[ratioPFC])


    useEffect(() => {
        fetchData()
    }, [mealLoading]);

    // API経由でログインユーザーのpfcを取得
    const fetchData = async() => {
        try {
            const authToken = localStorage.getItem('authToken')
            const response = await fetch(`${BACKEND_ENDPOINT}/main/pfc-by-date/?date=${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'X-CSRFToken': getCookie('csrftoken') ,
            },
            });

            const data = await response.json();
            setPfcData(data);
            console.log('Success fetchPFC!')
        } catch (error) {
            console.error('Error fetching data.:', error);
        } 
    };



    const getColor = (index) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56']; // ご希望の色を追加または変更
        return colors[index % colors.length];
    };
    
    return (
        <div className='flex flex-col text-sm'>       
            <ul className='flex justify-between'>
                {pfcData.map((item, index) => (
                    <li key={index} style={{backgroundColor: getColor(index), width:50}}>
                        <p>{item.nutrient[0].toUpperCase()} {Math.round(item.amount)}g</p>
                    </li>
                ))}
                {/* <NavLink to={`/meal/nutrients-graph/${selectedDate}`}>More</NavLink> */}
                {/* <div style={{ width: '150px', height: '150px' }}>
                    <div style={{ width: '100%', height: '30px', backgroundColor: '#ddd', marginTop: '10px' }}>
                    </div>
                </div> */}
            </ul>

            
            <div className='skeleton' style={{ width: '100%', height: '30px', marginTop: '10px', position: 'relative' }}>
                {totalAmount > 0 &&pfcData.map((item, index) => (
                <React.Fragment key={index}>
                    <div
                    style={{
                        width: `${(item.amount / totalAmount) * 100}%`,
                        height: '100%',
                        backgroundColor: getColor(index),
                        display: 'inline-block',
                        position: 'absolute',
                        top: 0,
                        left: `${pfcData.slice(0, index).reduce((acc, i) => acc + (i.amount / totalAmount) * 100, 0)}%`,
                        marginBottom: '2px', // 適切な間隔を確保
                        
                    }}
                    className='flex justify-center items-center'
                    >

                        <div className='justify-self-center'>{Math.round(item.amount/totalAmount*100)} % </div>
                    
                    </div>
                </React.Fragment>
                ))}
            </div> 

            
            <div className={`btn btn-xs ${mesClass}`} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{mes}</span>
            </div>
            
        </div> 
        );
        
};

export default PFCByDate;

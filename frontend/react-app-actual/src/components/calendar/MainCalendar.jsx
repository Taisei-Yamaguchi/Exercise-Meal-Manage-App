import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import getCookie from '../../hooks/getCookie';
import { BACKEND_ENDPOINT } from '../../settings';

const MainCalendar = ({month}) => {
    
    const [selectedMonth,setSelectedMonth] = useState(month)
    const [date, setDate] = useState(selectedMonth ? new Date(`${selectedMonth}T00:00:00Z`) : new Date());
    const [data, setData] = useState([]);


    // go Previous month.
    const handlePrevious = () => {
        const [year, month] = selectedMonth.split('-').map(Number);
        // Calculate the new month and year
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth === 0) {
            // If the new month is 0 (January), set it to 12 and decrement the year
            newMonth = 12;
            newYear = year - 1;
        }
        // Format the new month and year as a string
        const newSelectedMonth = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
        setSelectedMonth(newSelectedMonth);
    };

    // go Next month.
    const handleNext =()=>{
        const [year, month] = selectedMonth.split('-').map(Number);
        // Calculate the new month and year
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
            // If the new month is 0 (January), set it to 12 and decrement the year
            newMonth = 1;
            newYear = year + 1;
        }
        // Format the new month and year as a string
        const newSelectedMonth = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
        setSelectedMonth(newSelectedMonth);
    }

    // setDate when selectedMonth Change.
    useEffect(()=>{
        setDate(selectedMonth ? new Date(`${selectedMonth}T00:00:00Z`) : new Date())
    },[selectedMonth])

    // fetch Register Sattus Data first render.
    useEffect(()=>{
        fetchData()
    },[])

    // fetch RegisterStatus Data
    const fetchData = async () => {
        try {
        const authToken = localStorage.getItem('authToken')
        const response = await fetch(`${BACKEND_ENDPOINT}/main/registration-status-check/`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
            'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        const data = await response.json();
        if(response.ok){
            setData(data);
            console.log('Success fetchRegistrationStatus!');
        }else{
            console.log('Error!');
        }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    // Month Year String
    const getMonthYearString = () => {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString(undefined, options);
    };


    // get Days in Month
    const getDaysInMonth = () => {
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const daysInMonth = [];
        // Add days from the current month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
            dayDate.isOtherMonth = false;
            daysInMonth.push(dayDate);
        }
        return daysInMonth;
    };



// render day func
const renderDay = (day) => {
    const isCurrentMonth = day.getMonth() === date.getMonth();
    // const isSunday = day.getDay() === 0; // Sunday
    // const isSaturday = day.getDay() === 6; // Saturday
    const classNames = isCurrentMonth ? 'day' : 'day other-month';
    const  formattedDate= `${day.getFullYear()}-${(day.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;
    const key = `${isCurrentMonth ? 'current' : 'other'}-${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`;
    const dayData = data.find(item => item.date === day.toISOString().split('T')[0]);
    // render date
    return (
        <div key={key} className={`${classNames} text-xs p-0`}>
            {isCurrentMonth && !day.isOtherMonth ? (
            <div className='border'>
                {day.getDate()}
                <br />
                {day.toLocaleDateString('en-US', { weekday: 'short' })} {/* 曜日を表示 */}
                <br />

                
                <Link to={`/meal/${formattedDate}`} className='flex flex-row justify-between'>
                    <img src='/icons/meal-icon.svg' className='w-4 h-4'></img>
                    <div className=''>{dayData && dayData.meal ? '✔️' : '◻︎'}</div>
                </Link>
                
                <Link to={`/exercise/${formattedDate}`} className='flex flex-row justify-between'>
                    <img src='/icons/exercise-icon.svg' className=' w-4 h-4'></img>
                    <div className=''>{dayData && dayData.exercise ? '✔️' : '◻︎'}</div>
                </Link>
                
            </div>
            ) : null}
        </div>
    );
};


// render
return (
    <div >
        <div className="calendar-header">
            <h2 onClick={handlePrevious} className='cursor-pointer'>Previous</h2>
            <h2>{getMonthYearString()}</h2>
            <h2 onClick={handleNext} className='cursor-pointer'>Next</h2>
        </div>
        <div className="calendar-days max-xs:flex max-xs:flex-wrap">
            {getDaysInMonth().map(renderDay)}
        </div>
    </div>
    );
};

export default MainCalendar;

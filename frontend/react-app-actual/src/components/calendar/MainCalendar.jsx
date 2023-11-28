import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../Navigation';
import useAuthCheck from '../../hooks/useAuthCheck';
import getCookie from '../../hooks/getCookie';

const MainCalendar = () => {
    const { month } = useParams();
    const [date, setDate] = useState(month ? new Date(`${month}T00:00:00Z`) : new Date());
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://127.0.0.1:8000/main/registration-status-check/', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
            'X-CSRFToken': getCookie('csrftoken'),
            },
        });

        const data = await response.json();
        setData(data);
        console.log(data);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    useAuthCheck(fetchData);

    useEffect(() => {
        setDate(month ? new Date(`${month}-01T00:00:00`) : new Date());
    }, [month]);


    const getPreviousMonthLink = () => {
        const [year, month2] = month.split('-').map(Number);
        const newMonth = (parseInt(month2) - 1) <= 0 ? 12 : (parseInt(month2) - 1);
        const newYear = (parseInt(month2) - 1) <= 0 ? year - 1 : year;
        const formattedPreviousMonth = `${newYear}-${String(newMonth).padStart(2, '0')}`;
        return `/calendar/${formattedPreviousMonth}`;
    };


    const getNextMonthLink = () => {
        const [year, month2] = month.split('-').map(Number);
        const newMonth = (parseInt(month2) + 1) > 12 ? 1 : (parseInt(month2) + 1);
        const newYear = (parseInt(month2) + 1) > 12 ? year + 1 : year;
        const formattedNextMonth = `${newYear}-${String(newMonth).padStart(2, '0')}`;
        return `/calendar/${formattedNextMonth}`;
    };


    const getMonthYearString = () => {
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString(undefined, options);
    };


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




const renderDay = (day) => {
    const isCurrentMonth = day.getMonth() === date.getMonth();
    const isSunday = day.getDay() === 0; // Sunday
    const isSaturday = day.getDay() === 6; // Saturday
    const classNames = isCurrentMonth ? 'day' : 'day other-month';
    const  formattedDate= `${day.getFullYear()}-${(day.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;
    const key = `${isCurrentMonth ? 'current' : 'other'}-${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`;
    const dayData = data.find(item => item.date === day.toISOString().split('T')[0]);


    return (
        <div key={key} className={`${classNames} `}>
            {isCurrentMonth && !day.isOtherMonth ? (
            <>
                {day.getDate()}
                <br />
                {day.toLocaleDateString('en-US', { weekday: 'short' })} {/* 曜日を表示 */}
                <br />
                <Link to={`/meal/${formattedDate}`}>{dayData && dayData.meal ? 'meal ✔️' : 'meal ◻︎'}</Link>
                <br />
                <Link to={`/exercise/${formattedDate}`}>{dayData && dayData.exercise ? 'exercise ✔️' : 'exercise ◻︎'}</Link>
                
            </>
            ) : null}
        </div>
    );
};



return (
    <div className='container'>
        <Navigation />
        <div className="sub-container calendar">
            <div className="calendar-header">
            <Link to={getPreviousMonthLink()}>P</Link>
            <h2>{getMonthYearString()}</h2>
            <Link to={getNextMonthLink()}>N</Link>
            </div>
            <div className="calendar-days">
            {getDaysInMonth().map(renderDay)}
            </div>
        </div>
        </div>
    );
};

export default MainCalendar;

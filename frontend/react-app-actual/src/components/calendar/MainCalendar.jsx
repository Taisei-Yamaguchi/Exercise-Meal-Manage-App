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
        <div className="sub-container calendar">
            <div className="drawer open-nav">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                        <label htmlFor="my-drawer" className="btn btn-circle swap swap-rotate drawer-button">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox" />
                            <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                            <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
                        </label>
                </div> 
                <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <Navigation />
                </div>
            </div>

            <div className="calendar-header">
            <Link to={getPreviousMonthLink()}>Previous</Link>
            <h2>{getMonthYearString()}</h2>
            <Link to={getNextMonthLink()}>Next</Link>
            </div>
            <div className="calendar-days">
            {getDaysInMonth().map(renderDay)}
            </div>
        </div>
    </div>
    );
};

export default MainCalendar;

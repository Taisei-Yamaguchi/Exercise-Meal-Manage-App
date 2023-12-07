// src/components/meal/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


const Calendar = ({ selectedDate, onDateChange }) => {
    const [calendarDates, setCalendarDates] = useState([]);
    const navigate=useNavigate()

    useEffect(() => {
        // 今回は前後2日間分を表示する例ですが、必要に応じて変更してください
        const daysToShow = [-2, -1, 0, 1, 2];
        
        const currentDate = new Date(selectedDate);
        const formattedDates = daysToShow.map((day) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + day);
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
        });

        setCalendarDates(formattedDates);
    }, [selectedDate]);

    return (
            <div className="calendar-container join">
                
                {calendarDates.map((date) => (
                    <a key={date} href={`./${date}`} 
                        className={`pagination join-item  btn ${date === selectedDate ? 'bg-amber-500/100' : 'bg-amber-400/100'}`}
                    >
                        {date.split('-').slice(1).join('/')}
                    </a>
                ))}
                <NavLink to={`/calendar/${selectedDate.split('-').slice(0,2).join('-')}`}><img src='/icons/calendar.svg' className="swap-off fill-current w-10 h-10"></img></NavLink>
            </div>
    );
};

export default Calendar;

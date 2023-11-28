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

    const currentDate = new Date();
    const  formattedCurrentDate= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


    

    return (
        <div>
        
        <div className="calendar-container">
            
            {calendarDates.map((date) => {
                const currentDate = new Date();
                const  formattedCurrentDate= `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            
                const displayDate =
                date === formattedCurrentDate
                    ? 'Today'
                    : date.split('-').slice(1).join('/');
                
                return (
                    <div key={date} className="calendar-date">
                        {/* navLinkが使えない NavLinkだとページ移動後、fetchExerciseがされない*/}
                        {/* <NavLink to={`/exercise/${date}`}>{displayDate}</NavLink> */}
                        <a href={`/exercise/${date}`}>{displayDate}</a>
                    </div>
                );
            })}
        </div>
        </div>
    );
};

export default Calendar;

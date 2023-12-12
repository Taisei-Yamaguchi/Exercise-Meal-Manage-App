// src/components/meal/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import MainCalendar from '../../calendar/MainCalendar';

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
        <div className='calendar-container flex items-between  w-full pl-4 pr-4'>  
                <img 
                    src='/icons/calendar.svg' 
                    className="swap-off fill-current w-10 h-10 cursor-pointer max-sm:w-6 msx-sm:h-6" 
                    onClick={() => document.getElementById(`my_modal_calendar`).showModal()}>
                </img>    
                    <dialog id={`my_modal_calendar`} className="modal">
                        <div className="modal-box w-11/12 max-w-5xl text-slate-500">
                            <MainCalendar  month={`${selectedDate.split('-').slice(0,2).join('-')}`}/>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button >✕</button>
                        </form>
                    </dialog>
            
            <div className=" join ">
                {calendarDates.map((date) => (
                    <a key={date} href={`./${date}`} 
                        className={`pagination join-item max-sm:btn-xs btn ${date === selectedDate ? ' btn-accent' : 'btn-outline btn-accent'}`}
                    >
                        {date.split('-').slice(1).join('/')}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Calendar;

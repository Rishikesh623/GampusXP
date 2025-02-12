import React, { useState } from 'react';
import '../style/Calendar.css';

const CustomCalendar = ({ dueAssignments, dueChallenges }) => {
    const [hoveredDate, setHoveredDate] = useState(null);
    const [details, setDetails] = useState('');

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Helper function to format date as "D/M/YYYY"
    const formatDate = (day) => {
        const month = currentMonth + 1; // JavaScript months are 0-indexed
        return `${day}/${month}/${currentYear}`;
    };

    // Combine assignments and challenges into a single array with labels and statuses
    const markedDates = [
        ...dueAssignments.map(item => ({
            date: item.date,
            type: `Assignment (${item.status || 'unknown'})`,
            status: item.status || 'unknown',
        })),
        ...dueChallenges.map(item => ({
            date: item.date,
            type: `Challenge (${item.status || 'unknown'})`,
            status: item.status || 'unknown',
        })),
    ];

    const handleMouseEnter = (date) => {
        const match = markedDates.find(item => item.date === date);
        if (match) {
            setHoveredDate(date);
            setDetails(`${match.type} due on ${date}`);
        }
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
        setDetails('');
    };

    // console.log(currentDate.getDate());

    return (
        <div className="custom-calendar">
            <h3 className="calendar-title">{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h3>
            <div className="calendar-grid">
                {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const formattedDate = formatDate(day);
                    const matchedDate = markedDates.find(item => item.date === formattedDate);

                    const isMarked = !!matchedDate;
                    const statusClass = matchedDate
                        ? matchedDate.status === 'pending'
                            ? 'pending'
                            : matchedDate.status === 'completed'
                                ? 'completed'
                                : ''
                        : '';

                    return (
                        <div
                            key={day}
                            className={`calendar-cell ${isMarked ? 'marked' : ''} ${statusClass} ${currentDate.getDate() === day ? 'border-2 border-yellow-400' : ''}`}
                            onMouseEnter={() => handleMouseEnter(formattedDate)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
            {hoveredDate && (
                <div className="calendar-tooltip">
                    {details}
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;

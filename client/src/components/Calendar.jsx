import React, { useState } from 'react';
import '../style/Calendar.css';

const Calendar = ({ dueAssignments, dueChallenges }) => {
    const [hoveredDate, setHoveredDate] = useState(null);
    const [details, setDetails] = useState(null);

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
        const matches = markedDates.filter(item => item.date === date);
        if (matches.length > 0) {
            setHoveredDate(date);
            setDetails(matches.map(m => `${m.type} due on ${date}`));
        }
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
        setDetails('');
    };

    // console.log(currentDate.getDate());

    return (
        <div className="grid grid-cols-7 sm:grid-cols-7 xs:grid-cols-5 gap-2 w-full max-w-[400px] sm:max-w-none">
            {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const formattedDate = formatDate(day);
                const matchedDate = markedDates.find(item => item.date === formattedDate);

                const isMarked = !!matchedDate;
                const statusClass = matchedDate
                    ? matchedDate.status === 'pending'
                        ? 'bg-yellow-200'
                        : matchedDate.status === 'completed'
                            ? 'bg-green-300'
                            : ''
                    : '';

                return (
                    <div
                        key={day}
                        className={`text-center rounded-lg p-2 text-sm sm:text-base ${isMarked ? statusClass : 'bg-gray-100'} ${currentDate.getDate() === day ? 'border-2 border-yellow-400' : ''
                            }`}
                        onMouseEnter={() => handleMouseEnter(formattedDate)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {day}
                        {hoveredDate === formattedDate && (
                            <div className="absolute z-20 top-20 -right-10 -translate-x-1/2 bg-base-100 text-sm px-3 py-2 rounded-md shadow-lg border border-gray-200 whitespace-nowrap">
                                {details.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

        </div>


    );
};

export default Calendar;

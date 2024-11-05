import React from 'react';

const Timetable = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Timetable</h1>
            
            <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Monday</h2>
                    <ul>
                        <li>10:00 - 11:00 AM: Math</li>
                        <li>11:30 - 12:30 PM: Science</li>
                        <li>2:00 - 3:00 PM: English</li>
                    </ul>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Tuesday</h2>
                    <ul>
                        <li>9:00 - 10:00 AM: History</li>
                        <li>11:00 - 12:00 PM: Geography</li>
                        <li>1:00 - 2:00 PM: Art</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Timetable;

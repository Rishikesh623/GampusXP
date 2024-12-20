import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';


const Timetable = () => {

    const initialTimetable = [
        {
            "day": "Monday",
            "slots": [

                {
                    "time": "10:15 AM - 11:15 AM",
                    "course": "Physics"
                },
                {
                    "time": "11:30 AM - 12:30 PM",
                    "course": "Chemistry"
                }
            ]
        },
        {
            "day": "Tuesday",
            "slots": [
                {
                    "time": "09:00 AM - 10:00 AM",
                    "course": "Biology"
                },
                {
                    "time": "10:15 AM - 11:15 AM",
                    "course": "History"
                },
                {
                    "time": "11:30 AM - 12:30 PM",
                    "course": "English"
                }
            ]
        },
        {
            "day": "Wednesday",
            "slots": [
                {
                    "time": "09:00 AM - 10:00 AM",
                    "course": "Computer Science"
                },
                {
                    "time": "10:15 AM - 11:15 AM",
                    "course": "Mathematics"
                },
                {
                    "time": "11:30 AM - 12:30 PM",
                    "course": "Geography"
                }
            ]
        }
    ];

    const [timetable, setTimetable] = useState(null);

    useEffect(() => {
        async function fetchTimetable() {
            try {
                const res = await axios.get('http://localhost:5000/timetable', {
                    withCredentials: true, // Include cookies in the request
                });

                console.log(res);

            } catch (error) {
                console.error('Error fetching timetable:', error);
                setTimetable(null);
            }
        }

        fetchTimetable();
    }, []);

    const [day, setDay] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newCourse, setNewCourse] = useState('');


    const timeSlots = null;
    //  [...new Set(timetable.flatMap((entry) => entry.slots.map((slot) => slot.time)))].sort((a, b) => {
    //     const parseTime = (time) => {
    //         const [hourMinute, period] = time.split(" ");
    //         const [hour, minute] = hourMinute.split(":").map(Number);
    //         const isPM = period === "PM";
    //         // Convert to 24-hour format for accurate comparison
    //         return (isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour) * 60 + minute;
    //     };
    //     return parseTime(a.split(" - ")[0]) - parseTime(b.split(" - ")[0]);
    // });

    const [editMode, setEditMode] = useState(false);








    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTime || !newCourse || !day) return; // Ensure both fields are filled

        // Add the new slot to the timetable
        const updatedTimetable = [...timetable];

        const index = updatedTimetable.findIndex((e, i) => e.day === day);

        updatedTimetable[index].slots.push({ time: newTime, course: newCourse }); // Add to Monday for example

        // Update the state with the new timetable
        setTimetable(updatedTimetable);

        // Clear the input fields
        setNewTime('');
        setNewCourse('');
    };

    const handleSaveChanges = () => {
        try {

        }
        catch (err) {
            console.log(err.response.data.message)
        }
    };

    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "lightblue" }}>
            <h1 className="text-2xl font-bold mb-4">Timetable</h1>
            {
                !timetable &&
                <>
                    <p>TimeTable not found</p>
                    <label className="btn btn-outline btn-primary">Create timetable</label>
                </>
            }
            {
                timetable &&
                <>
                    <div className="overflow-x-auto">
                        <table className="table-lg" border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    {timeSlots.map((time, index) => (
                                        <th key={index}>{time}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.day}</td>
                                        {timeSlots.map((time, slotIndex) => {
                                            const slot = entry.slots.find((s) => s.time === time);
                                            return <td key={slotIndex}>{slot ? slot.course : "-"}</td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <label className="btn btn-outline btn-primary" onClick={() => setEditMode(true)}>Edit mode</label>
                    {editMode &&
                        <>
                            <label htmlFor="my_modal_6" className="btn btn-outline btn-primary">Add slot</label>
                            <label onClick={handleSaveChanges} className="btn btn-outline btn-primary">Save changes</label>
                            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                            <div className="modal" role="dialog">

                                <div className="modal-box">
                                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                                        <input
                                            type="text"
                                            placeholder="Course"
                                            onChange={(e) => setNewCourse(e.target.value)}
                                            value={newCourse}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" />
                                        <input
                                            type="text"
                                            placeholder="Time (e.g., 01:00 PM - 02:00 PM)"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" />
                                        <input
                                            type="text"
                                            placeholder="Day"
                                            onChange={(e) => setDay(e.target.value)}
                                            value={day}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" />

                                        <div className="modal-action">
                                            <button className="btn btn-outline btn-primary" type="submit" style={{ padding: '5px 10px' }}>Add Slot</button>

                                            <label htmlFor="my_modal_6" className="btn">Close!</label>
                                        </div>
                                    </form>



                                </div>
                            </div>
                        </>
                    }
                </>
            }

        </div>
    );
};

export default Timetable;

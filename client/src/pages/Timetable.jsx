import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';


const Timetable = () => {

    const initialTimetable = [
        {
            "day": "Monday",
            "slots": []
        },
        {
            "day": "Tuesday",
            "slots": []
        },
        {
            "day": "Wednesday",
            "slots": []
        },
        {
            "day": "Thursday",
            "slots": []
        },
        {
            "day": "Friday",
            "slots": []
        },
        {
            "day": "Saturday",
            "slots": []
        },
        {
            "day": "Sunday",
            "slots": []
        }
    ];

    const [timetable, setTimetable] = useState(null);

    useEffect(() => {
        async function fetchTimetable() {
            try {
                const res = await axios.get('http://localhost:5000/timetable', {
                    withCredentials: true, // Include cookies in the request
                });

                setTimetable(res.data);

            } catch (error) {
                console.error('Error fetching timetable:', error);
                setTimetable(null);
            }
        }

        fetchTimetable();
    }, []);

    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [course, setCourse] = useState('');
    const [slotId, setSlotId] = useState('');

    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (timetable) {
            const temp = [...new Set(timetable.flatMap((entry) => entry.slots.map((slot) => slot.time)))].sort((a, b) => {
                const parseTime = (time) => {
                    const [hourMinute, period] = time.split(" ");
                    const [hour, minute] = hourMinute.split(":").map(Number);
                    const isPM = period === "PM";
                    // Convert to 24-hour format for accurate comparison
                    return (isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour) * 60 + minute;
                };
                return parseTime(a.split(" - ")[0]) - parseTime(b.split(" - ")[0]);
            });
            setTimeSlots(temp);
        }
    }, [timetable])


    const [editMode, setEditMode] = useState(false);

    // to create timetable at db
    const handleCreate = async () => {

        try {
            const res = await axios.post('http://localhost:5000/timetable/create', { timetable: initialTimetable }, {
                withCredentials: true, // Include cookies in the request
            });

            setTimetable(initialTimetable);

            alert(res.data.message);
        } catch (error) {
            alert('Error creating timetable:', error);

        }
    };


    //to add time slot
    const handleSubmit = (e) => {
        e.preventDefault();

        setTimeSlots(prev => {
            if (!prev.includes(time)) {
                return [...prev, time];
            }
            return prev;
        });

        setTime('');
        setCourse('');
    };

    //for edit or add slot
    const handleSave = async (e) => {
       
        try {

            if (slotId != '') {
                const res = await axios.patch('http://localhost:5000/timetable/edit-slot', {
                    day, slotId, newTime: time, newCourse: course
                }, {
                    withCredentials: true, // Include cookies in the request
                });
                setTimetable(res.data.timetable);
                alert(res.data.message);
            } else {
                const res = await axios.patch('http://localhost:5000/timetable/add-slot', {
                    day, time, course
                }, {
                    withCredentials: true, // Include cookies in the request
                });
                setTimetable(res.data.timetable);
                alert(res.data.message);
            }

            setCourse('');
            setTime('');
            setSlotId('');

        } catch (error) {
            alert('Error while saving', error);

        }
    };

    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "lightblue" }}>
            <h1 className="text-2xl font-bold mb-4">Timetable</h1>
            {
                !timetable &&
                <>
                    <p>TimeTable not found</p>
                    <label onClick={() => handleCreate()} className="btn btn-outline btn-primary">Create timetable</label>
                </>
            }
            {
                timetable &&
                <>

                    <div className="overflow-x-auto">
                        <table className="table-lg" border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    {timeSlots?.map((time, index) => (
                                        <th key={index}>{time}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable?.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.day}</td>
                                        {timeSlots?.map((time, slotIndex) => {
                                            const slot = entry.slots.find((s) => s.time === time);
                                            return (

                                                <td key={slotIndex}>
                                                    <div>
                                                        {slot ? slot.course : "   -   "}
                                                        {editMode &&
                                                            <button onClick={
                                                                () => {
                                                                    setDay(entry.day);
                                                                    setTime(time);

                                                                    if (slot?.course)
                                                                        setSlotId(slot._id);
                                                                    document.getElementById('my_modal_input').showModal();
                                                                }
                                                            }>
                                                                {
                                                                    slot ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 576 512">
                                                                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 448 512">
                                                                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
                                                                    )
                                                                }
                                                            </button>


                                                        }
                                                    </div>

                                                </td>

                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {
                        !editMode && 

                    <label className="btn btn-outline btn-primary" onClick={() => setEditMode(true)}>Edit mode</label>
                    }
                    {editMode &&
                        <>
                        <label className="btn btn-outline btn-primary" onClick={() => setEditMode(false)}>Back to View mode</label>
                            <label htmlFor="my_modal_6" className="btn btn-outline btn-primary">Add slot</label>
                            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                            <div className="modal" role="dialog">

                                <div className="modal-box">
                                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

                                        <input
                                            type="text"
                                            placeholder="Time (e.g., 01:00 PM - 02:00 PM)"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" />
                                        {/* <input
                                            type="text"
                                            placeholder="Day"
                                            onChange={(e) => setDay(e.target.value)}
                                            value={day}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" /> */}

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
            <dialog id="my_modal_input" className="modal">
                <div className="modal-box">
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                            <input
                                type="text"
                                placeholder="enter Course"
                                onChange={(e) => setCourse(e.target.value)}
                                value={course}
                                className="input input-bordered input-primary w-full max-w-xs" />

                            <button className="btn" onClick={handleSave}>save</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Timetable;

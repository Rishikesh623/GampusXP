import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeTable } from '../redux/timetable/timetableSlice';
import Layout from "../components/Layout";
import { useToast } from '../components/ToastProvider';
import OverlayLoader from '../components/OverlayLoader';


const Timetable = () => {

    const currentTimeTable = useSelector((state) => state.ctimetable);
    const dispatch = useDispatch();
    const { showToast } = useToast();

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

    const [timetable, setTimetable] = useState(initialTimetable);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchTimetable() {
            try {
                setLoading(true)
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/timetable`, {
                    withCredentials: true,
                });
                setTimetable(res.data);
                dispatch(setTimeTable({ ctimetable: res.data }));
                setLoading(false)
            } catch (error) {
                setLoading(false)
                showToast({ message: error.response?.data?.message || error.message || "Something went wrong while fetching leaderboards data . Please contact on help.", type: "error" });
                setTimetable(null);
            }
        }
        fetchTimetable();

    }, []);

    useEffect(() => {
        console.log("Store time table : ", currentTimeTable); // Logs updated state when it changes
    }, [currentTimeTable]);

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
            dispatch(setTimeTable(timetable));
        }

        // console.log(timetable);
    }, [timetable])


    const [editMode, setEditMode] = useState(false);

    // to create timetable at db
    const handleCreate = async () => {

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/timetable/create`, { timetable: initialTimetable }, {
                withCredentials: true, // Include cookies in the request
            });

            setTimetable(initialTimetable);
            dispatch(setTimeTable(timetable));

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
                const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/timetable/edit-slot`, {
                    day, slotId, newTime: time, newCourse: course
                }, {
                    withCredentials: true, // Include cookies in the request
                });
                setTimetable(res.data.timetable);
                dispatch(setTimeTable({ timeTable: res.data.timetable }));
            } else {
                const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/timetable/add-slot`, {
                    day, time, course
                }, {
                    withCredentials: true, // Include cookies in the request
                });
                setTimetable(res.data.timetable);
                dispatch(setTimeTable(initialTimetable));
            }

            setCourse('');
            setTime('');
            setSlotId('');

        } catch (error) {
            alert('Error while saving', error);

        }
    };

    return (
        <Layout title="🕒 Timetable ">

            <OverlayLoader loading={loading}>
                <div className='p-5 bg-white shadow-lg rounded-lg'>
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

                            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                                <table className="table-lg border rounded-lg " style={{ width: "100%", textAlign: "left" }}>
                                    <thead>
                                        <tr className='bg-blue-600 text-white text-lg'>
                                            <th>Day</th>
                                            {timeSlots?.map((time, index) => (
                                                <th key={index} >{time}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetable?.map((entry, index) => (
                                            <tr key={index} className="hover:bg-blue-100">
                                                <td className='text-black'>{entry.day}</td>
                                                {timeSlots?.map((time, slotIndex) => {
                                                    const slot = entry.slots.find((s) => s.time === time);
                                                    return (

                                                        <td key={slotIndex} className='text-blue-600 font-medium'>
                                                            <div>
                                                                {slot ? slot.course : "       "}
                                                                {editMode &&
                                                                    <button className="p-1" onClick={
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
                                                                                "✏️"
                                                                            ) : (
                                                                                "➕"
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

                                <label className="btn btn-outline btn-primary mt-5 " onClick={() => setEditMode(true)}>Edit mode</label>
                            }
                            {editMode &&
                                <>
                                    <label className="btn btn-outline btn-primary mt-5 mr-2" onClick={() => setEditMode(false)}>Back to View mode</label>
                                    <label htmlFor="my_modal_6" className="btn btn-outline btn-primary">Add slot</label>
                                    <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                                    <div className="modal" role="dialog">
                                        <div className="modal-box bg-white p-6 rounded-lg  max-w-xs">
                                            <h2 className="text-xl font-semibold mb-4">Add New Slot</h2>
                                            <form onSubmit={handleSubmit}>

                                                <input
                                                    type="text"
                                                    placeholder="Time (e.g., 01:00 PM - 02:00 PM)"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    required
                                                    className="input input-bordered input-primary w-full " />
                                                {/* <input
                                            type="text"
                                            placeholder="Day"
                                            onChange={(e) => setDay(e.target.value)}
                                            value={day}
                                            required
                                            className="input input-bordered input-primary w-full max-w-xs" /> */}

                                                <div className="modal-action flex justify-between">
                                                    <label htmlFor="my_modal_6" className="btn btn-outline btn-error">Close!</label>
                                                    <button className="btn btn-outline btn-success" type="submit" >Add Slot</button>

                                                </div>
                                            </form>



                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                    <dialog id="my_modal_input" className="modal">
                        <div className="modal-box bg-white p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Add New Slot</h2>
                            <div className="flex flex-col gap-4">
                                <input type="text" placeholder="Time (e.g., 01:00 PM - 02:00 PM)"
                                    value={time} onChange={(e) => setTime(e.target.value)}
                                    className="input input-bordered w-full" />
                                <input type="text" placeholder="Course Name" className="input input-bordered w-full"
                                    onChange={(e) => setCourse(e.target.value)} value={course} />

                            </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn btn-error">Close</button>
                                </form>
                                <button className="btn btn-success" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </dialog>

                </div>
            </OverlayLoader>
        </Layout>
    );
};

export default Timetable;

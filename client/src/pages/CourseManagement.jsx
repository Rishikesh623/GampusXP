import React from 'react';
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = () => {
        // Clear Redux state
        dispatch(logout());

        // Purge persisted data
        persistor.purge();

        navigate("/signin")
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Course Management</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-6">Add New Course</button>

            <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Math 101</h2>
                    <p>Chapters: 10 | Students: 40</p>
                    <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">View Details</button>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Science 201</h2>
                    <p>Chapters: 12 | Students: 35</p>
                    <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">View Details</button>
                </div>

                <button onClick={logoutHandler} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Logout</button>
            </div>
        </div>
    );
};

export default CourseManagement;

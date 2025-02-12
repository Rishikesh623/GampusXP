import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { updateEmail, updateRegNo } from '../redux/user/userSlice';
import axios from "axios";

const Profile = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        reg_no: currentUser.reg_no || "",
        name: currentUser.name || "",
        email: currentUser.email || "",
        about: currentUser.about || ""
    });

    useEffect(() => {
        setFormData({
            reg_no: currentUser.reg_no,
            name: currentUser.name,
            email: currentUser.email,
        });
        auraLevelHandler();
    }, [currentUser]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [level, setLevel] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const auraLevelHandler = () => {
        const md = 1000;
        const aura = currentUser.aura_points;
        const currentLevel = Math.floor(aura / md);
        const progressWithinLevel = (aura % md) / md;
        setLevel(currentLevel);
        setProgressPercentage(progressWithinLevel * 100);
    };

    const onChangeEditForm = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch('http://localhost:5000/user/profile/edit', formData, { withCredentials: true });
            const data = res.data;
            if (!res) return;
            dispatch(updateRegNo(data.reg_no));
            dispatch(updateEmail(data.email));
            setFormData({ reg_no: data.reg_no, name: data.name, email: data.email, about: data.about });
        } catch (err) {
            console.log(err.response.data.message);
        }
        setIsModalOpen(false);
    };

    return (
        <div className='min-h-screen w-full p-6 bg-gray-100 flex justify-center'>
            <div className="flex flex-col w-full max-w-6xl bg-white p-6 border rounded-xl shadow-lg">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-lg">
                    <div className="w-1/2 flex items-center">
                        <Link to="/">
                            <img src="/logo.png" alt="CampusXP" className="h-16 w-auto" />
                        </Link>
                    </div>
                    <div className="w-1/2 flex justify-end gap-8 items-center">
                        <p className="text-black text-2xl font-bold">{currentUser.name}</p>
                        <div className="dropdown relative">
                            <button className="flex items-center space-x-2 focus:outline-none">
                                <img src="/profile_picture.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                            </button>
                            <ul className="dropdown-content absolute right-0 mt-2 bg-white rounded-lg w-48 p-2 shadow-xl border border-gray-200">
                                <li><Link to="/profile" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">Profile</Link></li>
                                <li><Link to="/settings" className="block px-4 py-2 text-sm font-medium hover:bg-gray-100">Settings</Link></li>
                                <li><Link to="/signin" className="block px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className='grid grid-cols-2 gap-6 p-6'>
                    {/* Profile Info */}
                    <div className="bg-white border rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold mb-4">Profile</h2>
                        <p className="text-gray-600"><strong>Username:</strong> {currentUser.reg_no}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {currentUser.email}</p>
                        <p className="text-gray-600"><strong>About:</strong> {currentUser.about}</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-3 text-blue-600 hover:underline">Edit Profile</button>
                    </div>

                    {/* Aura Level & Activities */}
                    <div className="bg-white border rounded-lg p-6 shadow">
                        <h3 className="text-xl font-semibold">Aura Level</h3>
                        <div className="mt-2 bg-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-blue-600 text-xs font-medium text-white text-center p-1 leading-none" style={{ width: `${progressPercentage}%` }}>
                                {100 - Math.round(progressPercentage)}% to next level
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-4">Achievements</h3>
                        <ul className="mt-2 text-gray-600">
                            <li>⭐ Math Wizard</li>
                            <li>⭐ Science Champion</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-4">Recent Activities</h3>
                        <ul className="mt-2 text-gray-600">
                            <li>📌 Submitted assignment in Physics</li>
                            <li>📌 Earned 200 Aura points in Chemistry Quiz</li>
                            <li>📌 Unlocked "Science Champion" badge</li>
                        </ul>
                    </div>
                </div>

                {/* Modal for editing profile */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                            <form onSubmit={onSubmitEditForm}>
                                <input type="text" name="reg_no" value={formData.reg_no} onChange={onChangeEditForm} className="w-full p-2 border rounded mb-2" placeholder="Username" />
                                <input type="email" name="email" value={formData.email} onChange={onChangeEditForm} className="w-full p-2 border rounded mb-2" placeholder="Email" />
                                <input type="text" name="about" value={formData.about} onChange={onChangeEditForm} className="w-full p-2 border rounded mb-4" placeholder="About" />
                                <div className="flex justify-end space-x-4">
                                    <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

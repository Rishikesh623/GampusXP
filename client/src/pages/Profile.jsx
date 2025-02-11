import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { updateEmail, updateRegNo } from '../redux/user/userSlice';
import axios from "axios";

const Profile = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        reg_no: currentUser.reg_no,
        name: currentUser.name,
        email: currentUser.email,
        bio: ""
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
            setFormData({ reg_no: data.reg_no, name: data.name, email: data.email, bio: "" });
        } catch (err) {
            console.log(err.response.data.message);
        }
        setIsModalOpen(false);
    };

    return (
        <div className='h-screen w-full p-6  bg-gray-300 bg-base-400'>
            <div className="flex flex-col min-h-screen  bg-white p-6 border rounded-xl shadow-lg max-w-8xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md ">
                    <div className="w-1/2 flex items-center">
                        <img src="/logo.png" alt="CampusXP" className="h-20 w-auto" />
                    </div>

                    {/* Right side header items */}
                    <div className="w-1/2 flex justify-end gap-10">
                        {/* Profile Dropdown */}
                        <p class="text-black text-4xl font-black">{currentUser.name}</p>
                        <div className="dropdown ">
                            <button tabIndex={0} className="flex items-center space-x-2 focus:outline-none">
                                <img src="/profile_picture.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                            </button>

                            <ul tabIndex={0} className="dropdown-content absolute right-0 mt-2 bg-base-100 rounded-lg w-52 p-2 shadow-xl border border-gray-200">
                                <li>
                                    <Link to="/profile" className="block w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="block w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signin" className="block w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </header>
                {/* Profile Info */}
                <main className="p-6 bg-white border rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold">Profile</h2>
                    <div className="mt-4">
                        <label className="block text-gray-600 font-semibold">Username</label>
                        <p>{currentUser.reg_no}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 font-semibold">Email</label>
                        <p>{currentUser.email}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 font-semibold">Bio</label>
                        <p>Passionate learner at CampusXP</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="mt-3 text-blue-600 hover:underline">Edit Profile</button>
                </main>

                {/* Aura Level */}
                <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
                    <div className="text-gray-600 font-extrabold">Current Aura Level: {level}</div>
                    <div className="mt-2 bg-blue-100 rounded-lg">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg" style={{ width: `${progressPercentage}%` }}>
                            {100 - Math.round(progressPercentage)}% to next level
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">Achievements</h3>
                    <ul className="mt-2 space-y-2">
                        <li className="flex items-center space-x-2">
                            <span className="material-icons text-blue-600">star</span>
                            <span>Math Wizard</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="material-icons text-blue-600">star</span>
                            <span>Science Champion</span>
                        </li>
                    </ul>
                </div>

                {/* Recent Activities */}
                <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">Recent Activities</h3>
                    <ul className="mt-2 space-y-2">
                        <li>Submitted assignment in Physics</li>
                        <li>Earned 200 Aura points in Chemistry Quiz</li>
                        <li>Unlocked "Science Champion" badge</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Profile;
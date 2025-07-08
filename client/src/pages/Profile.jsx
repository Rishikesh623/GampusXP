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
            const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/profile/edit`, formData, { withCredentials: true });
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
<div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-6 space-y-6">

                {/* Header */}
                <header className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md border">
                    <Link to="/">
                        <img src="/logo.png" alt="GampusXP" className="h-12" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold text-gray-800">{currentUser.name}</p>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full border">
                                    <img src="/profile_picture.jpg" alt="Profile" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border">
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/settings">Settings</Link></li>
                                <li><Link to="/signin" className="text-red-500">Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Profile Info */}
                    <div className="bg-white rounded-xl shadow-md p-6 border space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700">
                            <span>👤</span> Profile
                        </h2>
                        <p className="text-gray-700"><strong>Username:</strong> {currentUser.reg_no}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {currentUser.email}</p>
                        <p className="text-gray-700"><strong>About:</strong> {currentUser.about || "—"}</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-outline btn-primary mt-3">
                            Edit Profile
                        </button>
                    </div>

                    {/* Aura Level & Activities */}
                    <div className="bg-white rounded-xl shadow-md p-6 border space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-yellow-600 flex items-center gap-2">🌟 Aura Level</h3>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-4 text-xs text-white text-center leading-4"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    {100 - Math.round(progressPercentage)}% to next level
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">🏆 Achievements</h3>
                            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                                <li>Math Wizard</li>
                                <li>Science Champion</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-pink-600 flex items-center gap-2">📌 Recent Activities</h3>
                            <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                                <li>Submitted assignment in Physics</li>
                                <li>Earned 200 Aura points in Chemistry Quiz</li>
                                <li>Unlocked "Science Champion" badge</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border space-y-4">
                            <h3 className="text-2xl font-bold text-center">Edit Profile</h3>
                            <form onSubmit={onSubmitEditForm} className="space-y-3">
                                <input
                                    type="text"
                                    name="reg_no"
                                    value={formData.reg_no}
                                    onChange={onChangeEditForm}
                                    className="input input-bordered w-full"
                                    placeholder="Username"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChangeEditForm}
                                    className="input input-bordered w-full"
                                    placeholder="Email"
                                />
                                <input
                                    type="text"
                                    name="about"
                                    value={formData.about}
                                    onChange={onChangeEditForm}
                                    className="input input-bordered w-full"
                                    placeholder="About"
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Save
                                    </button>
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

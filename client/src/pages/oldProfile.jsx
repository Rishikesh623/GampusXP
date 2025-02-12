import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { updateEmail, updateRegNo } from '../redux/user/userSlice';
import axios from "axios"

const Profile = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        reg_no: currentUser.reg_no,
        name: currentUser.name,
        email: currentUser.email,
        about: ""
    });

    useEffect(() => {
        setFormData({
            reg_no: currentUser.reg_no,
            name: currentUser.name,
            email: currentUser.email,
            // about: formData.about, // Retain about from local state
        });

        auraLevelHandler();
    }, [currentUser]);


    console.log(currentUser);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    const onChangeEditForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch('http://localhost:5000/user/profile/edit', formData, {
                withCredentials: true, // Include cookies in the request
            });

            const data = res.data;

            if (!res) {
                console.log("Edit profile failed", data.message)
                return;
            }

            // console.log(data)

            dispatch(updateRegNo(data.reg_no));
            dispatch(updateEmail(data.email));

            setFormData({
                reg_no: data.reg_no,
                name: data.name,
                email: data.email,
                about: ""
            });
        }
        catch (err) {
            console.log(err.response.data.message)
        }
        setIsModalOpen(false); // Close the modal after submission
    };

    const [level, setLevel] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const auraLevelHandler = () => {
        const md = 1000;
        const aura = currentUser.aura_points;
        // console.log(aura);
        const currentLevel = Math.floor(aura / md);
        const progressWithinLevel = (aura % md) / md;

        setLevel(currentLevel);
        setProgressPercentage(progressWithinLevel * 100);
    };

    const onClickEditButton = () => {
        setIsModalOpen(true); // Open the modal when "Edit Profile" is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Menu */}
            <aside className="w-64 bg-white border-r">
                <div className="flex items-center justify-center h-16 border-b">
                    <h1 className="text-xl font-bold text-blue-600">CampusXP</h1>
                </div>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/main">Dashboard</Link>
                        </li>
                        <li className="px-4 py-2 bg-blue-100 rounded text-blue-600 font-semibold">
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/settings">Settings</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Profile Content Area */}
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                    <h2 className="text-xl font-semibold">Profile</h2>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1">
                            Theme
                            <svg
                                width="12px"
                                height="12px"
                                className="inline-block h-2 w-2 fill-current opacity-60"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 2048 2048">
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl">
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Default"
                                    value="default"
                                    onChange={handleThemeChange}
                                    checked={currentTheme === 'default'} />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Retro"
                                    value="retro"
                                    onChange={handleThemeChange}
                                    checked={currentTheme === 'retro'} />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Cyberpunk"
                                    value="cyberpunk"
                                    onChange={handleThemeChange}
                                    checked={currentTheme === 'cyberpunk'} />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Valentine"
                                    value="valentine"
                                    onChange={handleThemeChange}
                                    checked={currentTheme === 'valentine'} />
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    aria-label="Aqua"
                                    value="aqua"
                                    onChange={handleThemeChange}
                                    checked={currentTheme === 'aqua'} />
                            </li>
                        </ul>
                    </div>
                </header>

                {/* Profile Details */}
                <main className="p-6">
                    <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
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
                            <label className="block text-gray-600 font-semibold">about</label>
                            <p>Passionate learner at CampusXP</p>
                        </div>
                        <button onClick={onClickEditButton} className="mt-3 text-blue-600 hover:underline">Edit Profile</button>
                    </div>

                    {/* Aura Points and Level */}
                    <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
                        <div className="text-gray-600 font-extrabold">Current Aura Level: {level}</div>
                        <div className="mt-2 bg-blue-100 rounded-lg">
                            <div className="mt-2 bg-blue-100 rounded-lg">
                                <div
                                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg"
                                    style={{ width: `${progressPercentage}%` }} // Dynamic width
                                >
                                    {100 - Math.round(progressPercentage)}% to next level
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
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
                    <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold">Recent Activities</h3>
                        <ul className="mt-2 space-y-2">
                            <li>Submitted assignment in Physics</li>
                            <li>Earned 200 Aura points in Chemistry Quiz</li>
                            <li>Unlocked "Science Champion" badge</li>
                        </ul>
                    </div>
                </main>

                {/* Modal for editing profile */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

                            <form onSubmit={onSubmitEditForm}>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Username</label>
                                    <input
                                        type="text"
                                        name="reg_no"
                                        value={formData.reg_no}
                                        onChange={onChangeEditForm}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder={currentUser.reg_no}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={onChangeEditForm}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder={currentUser.email}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">about</label>
                                    <input
                                        type="text"
                                        name="about"
                                        value={formData.about}
                                        onChange={onChangeEditForm}
                                        placeholder="Enter about"
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Save Changes
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
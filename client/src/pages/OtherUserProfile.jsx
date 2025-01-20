import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import axios from "axios"
import { useLocation } from 'react-router-dom';


const Profile = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme);
    const [currentUser, setCurrentUser] = useState({});
    const location = useLocation();

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    const regNo = location.state.reg_no || {};

    // console.log(regNo)

    const getProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/profile/${regNo}`);

            // console.log(res.data.userProfile);
            setCurrentUser(res.data.userProfile);
        }
        catch (err) {
            console.log("Error in getProfile", err);
        }
    }

    useEffect(() => {
        getProfile();
        auraLevelHandler();
    }, [currentUser]);

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
                            <Link to="/other-user-profile">Profile</Link>
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
                            <label className="block text-gray-600 font-semibold">Bio</label>
                            <p>Passionate learner at CampusXP</p>
                        </div>
                    </div>

                    {/* Aura Points and Level */}
                    <div className="mb-6 p-2 px-4 pb-4 bg-white border rounded-lg shadow-sm">
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
            </div>
        </div>
    );
};

export default Profile;

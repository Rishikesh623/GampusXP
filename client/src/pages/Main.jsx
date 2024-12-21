import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setTheme } from '../redux/theme/themeSlice';
const Main = () => {
    const dispatch = useDispatch();

    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);
    const [profileT, setProfileT] = useState(false);

    useEffect(() => {
        // console.log(currentUser);
    });
    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    }

    const profileToggle = () => {
        setProfileT(!profileT);
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Menu */}
            <aside className="w-64 bg-white border-r">
                <div className="flex items-center justify-center h-16 border-b">
                    <h1 className="text-xl font-bold text-blue-600">CampusXP</h1>
                </div>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        <li className="px-4 py-2 bg-blue-100 rounded text-blue-600 font-semibold">
                            <Link to="/">Dashboard</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/course-management">Course Management</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/assignment-tracking">Assignment Tracking</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/leaderboards">Leaderboards</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/rewards-challenges">Rewards and Challenges</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/timetable">Timetable</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                            <Link to="/settings">Settings</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search assignments, courses..."
                            className="px-4 py-2 border rounded-lg w-64 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
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

                        {/* Notifications Icon */}
                        <button className="relative">
                            <span className="material-icons">Notifications</span>
                            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button className="flex items-center space-x-2 focus:outline-none" onClick={profileToggle}>
                                <img
                                    src="/profile.jpg" // Example profile image
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="font-semibold">{currentUser.name}</span>
                            </button>

                            {/* Dropdown Menu */}

                            {
                                profileT && (<div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                                    <Link to="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</Link>
                                </div>)
                            }

                        </div>
                    </div>
                </header >

                {/* Dashboard Content */}
                < main className="p-6" >
                    {/* Greeting and Aura Points */}
                    < div className="mb-6" >
                        <h2 className="text-2xl font-bold">Welcome back, [{currentUser.name}]!</h2>
                        <div className="mt-2 text-gray-600">Current Aura Level: 3</div>
                        <div className="mt-2 bg-blue-100 rounded-lg">
                            <div
                                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg"
                                style={{ width: '75%' }}
                            >
                                75% to next level
                            </div>
                        </div>
                    </div >

                    {/* Quick Stats */}
                    < div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3" >
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
                            <p>3 assignments due this week</p>
                        </div>
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">Challenges in Progress</h3>
                            <p>2 challenges to complete</p>
                        </div>
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">Recent Achievements</h3>
                            <p>Completed "Math Wizard" challenge</p>
                        </div>
                    </div >

                    {/* Calendar View and Active Challenges */}
                    < div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6" >
                        {/* Calendar View */}
                        < div className="p-4 bg-white border rounded-lg shadow-sm" >
                            <h3 className="text-lg font-semibold">Calendar</h3>
                            {/* Example Calendar View */}
                            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
                                {[...Array(30).keys()].map(day => (
                                    <div key={day} className="p-2 bg-gray-100 rounded-lg">
                                        {day + 1}
                                    </div>
                                ))}
                            </div>
                        </div >

                        {/* Active Challenges */}
                        < div className="p-4 bg-white border rounded-lg shadow-sm" >
                            <h3 className="text-lg font-semibold">Active Challenges</h3>
                            <div className="mt-2">
                                <p>Challenge 1: Complete 5 quizzes</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div >
                    </div >

                    {/* Timetable Snapshot and Recent Activities */}
                    < div className="grid grid-cols-1 gap-4 lg:grid-cols-2" >
                        {/* Timetable Snapshot */}
                        < div className="p-4 bg-white border rounded-lg shadow-sm" >
                            <h3 className="text-lg font-semibold">Today's Timetable</h3>
                            <ul className="mt-2 space-y-2">
                                <li>10:00 - 11:00 AM: Math</li>
                                <li>11:30 - 12:30 PM: Science</li>
                                <li>2:00 - 3:00 PM: History</li>
                            </ul>
                        </div >

                        {/* Recent Activities Feed */}
                        < div className="p-4 bg-white border rounded-lg shadow-sm" >
                            <h3 className="text-lg font-semibold">Recent Activities</h3>
                            <ul className="mt-2 space-y-2">
                                <li>Completed assignment in Science</li>
                                <li>Earned 100 Aura points in Math Quiz</li>
                                <li>Started "Literature Challenge"</li>
                            </ul>
                        </div >
                    </div >
                </main >
            </div >
        </div >
    );
};

export default Main;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { persistor } from '../redux/store';
import { logout, setUserProfile } from '../redux/user/userSlice';
import axios from 'axios';
import { clearAssignment, setCAssignment } from '../redux/assignment/assignmentSlice';
import { clearChallegneS, setChallengeS } from '../redux/challenges/challengesSlice';
import { clearAchievement, setAchievement } from '../redux/achievement/achievementSlice';
import Calendar from "./Calendar";
// import '../style/Main.css';

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);

    const [isNotification, setIsNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unReadNotificationsCount, setUnReadNotificationsCount] = useState(0);
    const [profileT, setProfileT] = useState(false);
    const [dueAssignments, setDueAssignment] = useState([{}]);
    const [dueChallenges, setDueChallenges] = useState([{}]);
    const [level, setLevel] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    // Redux state slices
    const cassignment = useSelector((state) => state.cassignment.cassignment);
    const challengeS = useSelector((state) => state.challengeS.challengeS);
    const achievement = useSelector((state) => state.achievement.achievement);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/assignment', {
                    withCredentials: true,
                });
                const fetchedAssignments = res.data.assignments || [];
                const dueDates = fetchedAssignments
                    .filter(assignment => assignment.due_date)
                    .map(assignment => ({
                        date: new Date(assignment.due_date).toLocaleDateString(),
                        status: assignment.status
                    }));
                setDueAssignment(dueDates);
                dispatch(setCAssignment(fetchedAssignments));
            } catch (error) {
                if (error.response?.status === 404) {
                    dispatch(setCAssignment([]));
                } else {
                    console.error('Error fetching assignments:', error.response?.message);
                }
            }
        };

        const getChallenges = async () => {
            try {
                const res = await axios.get("http://localhost:5000/challenges/accepted", {
                    headers: {
                        coordinator: "true"
                    },
                    withCredentials: true
                });
                const dueDates = res.data.challenges
                    .filter(challenge => challenge.end_date)
                    .map(challenge => ({
                        date: new Date(challenge.end_date).toLocaleDateString(),
                        status: challenge.participantDetails?.status
                    }));
                setDueChallenges(dueDates);
                dispatch(setChallengeS(res.data.challenges));
            } catch (err) {
                console.error("Error fetching challenges:", err.response?.data?.message || err.message);
            }
        };

        const getAchievements = async () => {
            try {
                const res = await axios.get('http://localhost:5000/achievement/achievements/', { withCredentials: true });
                dispatch(setAchievement(res.data.achievements.achievements));
            } catch (err) {
                console.log("Error in fetching achievements:", err.response?.data?.message || err.message);
            }
        };

        const getUserProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/user/profile', {
                    withCredentials: true,
                });
                const data = res.data;
                if (res) {
                    dispatch(setUserProfile({
                        name: data.name,
                        reg_no: data.reg_no,
                        email: data.email,
                        password: data.password,
                        aura_points: data.aura_points
                    }));
                }
            } catch (err) {
                // Handle error if needed
            }
        };

        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/notifications/", {
                    withCredentials: true
                });
                setNotifications(res.data.notifications);
                const cnt = res.data.notifications.filter(nt => nt.is_read === false).length;
                setUnReadNotificationsCount(cnt);
            } catch (err) {
                console.log("Error in fetchNotifications:", err.message);
            }
        };

        // Call the functions
        fetchNotifications();
        getChallenges();
        fetchAssignments();
        getAchievements();
        auraLevelHandler();
        getUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentUser]);

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    const profileToggle = () => {
        setProfileT(!profileT);
    };

    const logoutHandle = () => {
        dispatch(logout());
        dispatch(clearAssignment());
        dispatch(clearChallegneS());
        dispatch(clearAchievement());
        persistor.purge();
    };

    const dueAssignmentHandler = () => {
        let cnt = 0;
        cassignment.forEach((assignment) => {
            if (assignment.status === "Pending") {
                cnt++;
            }
        });
        return cnt;
    };

    const dueChallengesHandler = () => {
        let cnt = 0;
        challengeS.forEach((challenge) => {
            if (challenge.participantDetails?.status === 'in-progress') cnt++;
        });
        return cnt;
    };

    const markNotification = async (id) => {
        try {
            await axios.patch("http://localhost:5000/notifications/mark-read", { notificationId: id }, {
                withCredentials: true,
            });
            // Optionally update the local state after marking as read.
        } catch (err) {
            console.log("Error in markNotification", err);
        }
    };

    const auraLevelHandler = () => {
        const md = 1000;
        const aura = currentUser.aura_points;
        const currentLevel = Math.floor(aura / md);
        const progressWithinLevel = (aura % md) / md;
        setLevel(currentLevel);
        setProgressPercentage(progressWithinLevel * 100);
    };

    return (
        <div className="drawer">
            {/* Hidden checkbox to control the drawer */}
            <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

            {/* Main content area */}
            <div className="drawer-content flex flex-col bg-gray-100 min-h-screen">
                {/* Header with logo and drawer toggle for mobile */}
                <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md ">
                    <div className="w-1/2 flex items-center">
                        {/* Mobile drawer toggle button */}
                        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <img src="/logo.png" alt="CampusXP" className="h-20 w-auto" />
                    </div>

                    {/* Right side header items */}
                    <div className="w-1/2 flex justify-end gap-4 px-4 py-2">
                        {/* Search Bar */}
                        <label className="w-1/2 input input-bordered input-info input-md flex items-center gap-2 w-full max-w-lg">
                            <input type="text" className="grow focus:outline-none" placeholder="Search assignments, courses..." />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>

                        {/* Theme Dropdown */}
                        <div className="dropdown">
                            <button tabIndex={0} className="btn btn-ghost flex items-center gap-2">
                                Theme
                                <svg className="w-4 h-4" viewBox="0 0 2048 2048" fill="currentColor">
                                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                                </svg>
                            </button>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg w-44 p-2 shadow-xl">
                                {['light', 'retro', 'cyberpunk', 'valentine', 'aqua'].map((theme) => (
                                    <li key={theme}>
                                        <input
                                            type="radio"
                                            name="theme-dropdown"
                                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                            value={theme}
                                            aria-label={theme}
                                            onChange={handleThemeChange}
                                            checked={currentTheme === theme}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Notifications Icon */}
                        <button className=" btn btn-ghost flex items-center gap-2" onClick={() => setIsNotification(true)}>
                            Inbox
                            {unReadNotificationsCount > 0 && (
                                <span className="badge badge-secondary absolute -top-2 -right-2 text-xs">
                                    {unReadNotificationsCount}
                                </span>
                            )}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="dropdown ">
                            <button tabIndex={0} className="flex items-center space-x-2 focus:outline-none" onClick={profileToggle}>
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
                                    <Link to="/signin" onClick={logoutHandle} className="block w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </header>

                {/* Main Dashboard Content */}
                <main className="p-4">
                    {/* Greeting & Aura Points */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">Welcome back, {currentUser.name}!</h2>
                        <div className="mt-1 text-gray-600">Current Aura Level: {level}</div>
                        <div className="mt-1 bg-blue-100 rounded-lg">
                            <div
                                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-lg"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                {100 - Math.round(progressPercentage)}% to next level
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-3">
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Upcoming Assignments</h3>
                            <p>{dueAssignmentHandler()} assignments due this week</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Challenges in Progress</h3>
                            <p>{dueChallengesHandler()} challenges to complete</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Recent Achievements</h3>
                            <ul className="list-disc ml-4">
                                {achievement.slice(0, 3).map((achievements) => (
                                    <li key={achievements._id} className="text-xs">{achievements.description}</li>
                                ))}
                            </ul>
                            <button onClick={() => navigate("/achievement-tracking")}
                                className="mt-2 px-2 py-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs"
                            >
                                See More
                            </button>
                        </div>
                    </div>

                    {/* Calendar & Active Challenges */}
                    <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Calendar</h3>
                            <Calendar dueAssignments={dueAssignments} dueChallenges={dueChallenges} />
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Active Challenges</h3>
                            <ul className="mt-2">
                                {challengeS.filter(challenge => challenge.participantDetails?.status === 'in-progress')
                                    .map(challenge => (
                                        <li key={challenge._id} className="text-sm">{challenge.title}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    {/* Timetable Snapshot & Recent Activities */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Today's Timetable</h3>
                            <ul className="mt-2 list-disc ml-4 text-sm">
                                <li>10:00 - 11:00 AM: Math</li>
                                <li>11:30 - 12:30 PM: Science</li>
                                <li>2:00 - 3:00 PM: History</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-base font-semibold">Recent Activities</h3>
                            <ul className="mt-2 list-disc ml-4 text-sm">
                                <li>Completed assignment in Science</li>
                                <li>Earned 100 Aura points in Math Quiz</li>
                                <li>Started "Literature Challenge"</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>

            {/* Drawer Side (Left Navigation Menu) */}
            <div className="drawer-side">
                <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
                <aside className="w-64 h-screen bg-white border-r">
                    <nav className="mt-6">
                        <ul className="space-y-2">
                            <li className="px-4 py-2 bg-blue-100 rounded text-blue-600 font-semibold">
                                <Link to="/">Dashboard</Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                                <Link to="/course-management-user">Course Management</Link>
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
            </div>

            {/* Notifications Modal */}
            {isNotification && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="p-4 h-5/6 w-11/12 md:w-3/4 bg-white border rounded-lg shadow-sm flex flex-col gap-2">
                        <h1 className="font-bold text-xl">Notifications</h1>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-2 w-11/12 h-auto border-2 ${notification.is_read === false ? 'border-red-600' : 'border-slate-100'} bg-slate-100 rounded-lg flex`}
                            >
                                <div>
                                    <h4 className="text-sm font-semibold">Title: {notification.title}</h4>
                                    <p className="text-sm">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => markNotification(notification._id)}
                                    className="z-100 p-1 px-2 ml-auto mt-auto text-xs bg-blue-400 rounded-lg"
                                >
                                    {notification.is_read === false ? "Mark As Read" : "Already Read"}
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsNotification(false)}
                            className="bg-blue-400 w-1/6 p-1 py-2 mt-auto mx-auto rounded-lg text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;

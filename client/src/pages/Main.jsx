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
import Calendar from "../components/Calendar"
import LeftDrawer from '../components/LeftDrawer';
import { setTimeTable } from '../redux/timetable/timetableSlice';
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
    const [todaysTimetable, setTodaysTimetable] = useState({});

    // Redux state slices
    const cassignment = useSelector((state) => state.cassignment.cassignment);
    const challengeS = useSelector((state) => state.challengeS.challengeS);
    const achievement = useSelector((state) => state.achievement.achievement);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/assignment`, {
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
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/challenges/accepted`, {
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
                if (cassignment.length !== 0) {
                    return;
                }
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/achievement/achievements/`, { withCredentials: true });
                if (res.data.achievements)
                    dispatch(setAchievement(res.data.achievements.achievements));
            } catch (err) {
                console.log("Error in fetching achievements:", err.response?.data?.message || err.message);
            }
        };

        const getUserProfile = async () => {
            try {
                if (currentUser.name !== null) {
                    return;
                }
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
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
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/notifications/`, {
                    withCredentials: true
                });
                setNotifications(res.data.notifications);
                const cnt = res.data.notifications.filter(nt => nt.is_read === false).length;
                setUnReadNotificationsCount(cnt);
            } catch (err) {
                console.log("Error in fetchNotifications:", err.message);
            }
        };

        const getTodaysTImetable = async () => {
            try {
                if (!todaysTimetable || Object.keys(todaysTimetable).length === 0) {
                    // Get current day
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const currentDay = days[new Date().getDay()];

                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/timetable/${currentDay}`, {
                        withCredentials: true,
                    });

                    if (res.data) {
                        setTodaysTimetable(res.data.days[0]);
                        dispatch(setTimeTable({ ctimetable: res.data.days }));
                    }
                }

            }
            catch (err) {
                console.error('Error fetching todays timetable:', err)
            }
        }

        // Call the functions
        fetchNotifications();
        getChallenges();
        fetchAssignments();
        getAchievements();
        auraLevelHandler();
        getUserProfile();
        getTodaysTImetable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

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
            if (assignment.status === "pending") {
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
            await axios.patch(`${process.env.REACT_APP_BASE_URL}/notifications/mark-read`, { notificationId: id }, {
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
        <div className="h-screen ">
            {/* Hidden checkbox to control the drawer */}
            <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

            {/* Main content area */}
            <div className="drawer-content flex flex-col bg-gray-100 h-full">
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
                        <div className='w-1/2'>
                            <label className="input input-bordered input-info input-md flex items-center gap-2 w-full max-w-lg">
                                <input type="text" className="grow focus:outline-none" placeholder="Search assignments, courses..." />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </label>
                        </div>

                        <div className='w-1/2 flex gap-2'>
                            {/* Theme Dropdown */}
                            <div className="w-2/4 dropdown">
                                <button tabIndex={0} className="btn w-full btn-ghost flex items-center gap-2">
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

                            <button className=" indicator w-1/4  btn btn-ghost flex items-center gap-2" onClick={() => setIsNotification(true)}>
                                Inbox
                                {unReadNotificationsCount > 0 && (
                                    <span className="indicator-item badge badge-secondary">{unReadNotificationsCount}</span>
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            <div className="w-1/4 dropdown flex justify-end">
                                <button tabIndex={0} className="flex items-center space-x-2 focus:outline-none" onClick={profileToggle}>
                                    <img src="/profile_picture.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                                </button>

                                <ul tabIndex={0} className="dropdown-content absolute right-0 mt-12 bg-base-100 rounded-lg w-52 p-2 shadow-xl border border-gray-200">
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
                    </div>

                </header>

                {/* Main Dashboard Content */}
                <main className="pt-3 pr-4 pl-4 pb-0">

                    {/* Greeting & Aura Points */}
                    <div className="mb-4 p-4 bg-base-100 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-semibold text-primary">Welcome back, {currentUser.name}!</h2>

                        <div className="mt-2 text-base-content text-sm flex justify-between">
                            <span className="font-medium">Current Aura Level:{level}</span>
                            <span className="font-medium">Total Aura points:{currentUser.aura_points}</span>
                        </div>

                        <div className="mt-3">
                            <div className="bg-base-200 rounded-full h-4">
                                <div
                                    className="bg-primary text-xs font-semibold text-primary-content text-center h-4 rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-3">
                        {/* Upcoming Assignments */}
                        <div className="card bg-base-100 shadow-md border">
                            <div className="card-body p-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    📌 Upcoming Assignments
                                </h3>
                                <p className="text-sm text-base-content">
                                    {dueAssignmentHandler()} assignments due this week
                                </p>
                            </div>
                        </div>

                        {/* Challenges in Progress */}
                        <div className="card bg-base-100 shadow-md border">
                            <div className="card-body p-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    🚀 Challenges in Progress
                                </h3>
                                <p className="text-sm text-base-content">
                                    {dueChallengesHandler()} challenges to complete
                                </p>
                            </div>
                        </div>

                        {/* Recent Achievements */}
                        <div className="card bg-base-100 shadow-md border">
                            <div className="card-body p-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    🏆 Recent Achievements
                                </h3>
                                {
                                    achievement.length == 0 &&

                                    <p className="text-sm text-base-content">
                                        No Achievements yet.
                                    </p>
                                }
                                <ul className="list-disc ml-4 text-sm text-base-content">
                                    {achievement.slice(0, 3).map((achievements) => (
                                        <li key={achievements._id} className="text-xs">{achievements.description}</li>
                                    ))}
                                </ul>
                                <div className="flex justify-end">
                                    {achievement.length > 3 && (
                                        <button
                                            onClick={() => navigate("/achievement-tracking")}
                                            className="btn btn-xs btn-primary mt-2"
                                        >
                                            See More
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* Two-column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">

                        {/* Left Box: Compact Calendar + Timetable */}
                        <div className="card bg-base-100 shadow-lg border p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-primary flex items-center gap-2 border-b pb-2">
                                📅 <span className="text-accent">Calendar & Timetable</span>
                            </h3>

                            <div className="flex gap-4 mt-2">
                                {/* Compact Calendar */}
                                <div className="w-2/3 border-r pr-4">
                                    <Calendar dueAssignments={dueAssignments} dueChallenges={dueChallenges} />
                                </div>

                                {/* Timetable Snapshot */}
                                <div className="w-1/3 bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-lg shadow-md">
                                    <h4 className="text-md mb-2 font-semibold text-secondary flex items-center gap-2">
                                        🕒 Timetable
                                    </h4>
                                    {todaysTimetable?.slots?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {todaysTimetable.slots.map((slot, index) => (
                                                <li
                                                    key={index}
                                                    className="flex justify-between items-center text-sm bg-white text-gray-800 px-3 py-1.5 rounded-md shadow-sm"
                                                >
                                                    <span className="font-semibold text-blue-600">{slot.time}</span>
                                                    <span className="text-right text-gray-700 text-sm">{slot.course}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-gray-500 text-sm italic">No classes today 🎉</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Box: Active Challenges + Recent Activities in One Row */}
                        <div className="card bg-base-100 shadow-lg border p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-primary flex items-center gap-2 border-b pb-2">
                                🔥 <span className="text-accent">Active Challenges & Recent Activities</span>
                            </h3>

                            <div className="flex gap-4 mt-3">
                                {/* Active Challenges (Left Side) */}
                                <div className="w-1/2 bg-base-200 p-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <h4 className="text-md font-semibold text-secondary flex items-center gap-2">
                                        🚀 Challenges
                                    </h4>
                                    <ul className="mt-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
                                        {challengeS.filter(challenge => challenge.participantDetails?.status === 'in-progress')
                                            .map(challenge => (
                                                <li key={challenge._id} className="text-sm py-1 border-b last:border-none hover:text-blue-500">
                                                    {challenge.title}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>

                                {/* Recent Activities (Right Side) */}
                                <div className="w-1/2 bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <h4 className="text-md font-semibold text-secondary flex items-center gap-2">
                                        🔄 Recent Activities
                                    </h4>
                                    <ul className="mt-2 text-sm list-disc ml-4 text-gray-700">
                                        <li>✅ Completed Science Assignment</li>
                                        <li>🏆 Earned 100 Aura points in Quiz</li>
                                        <li>📖 Started "Literature Challenge"</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>


                </main>
            </div>

            <LeftDrawer title="Dashboard" />

            {/* Notifications Modal */}
            {isNotification && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="p-4 h-5/6 w-11/12 md:w-3/4 bg-white border rounded-lg shadow-sm flex flex-col gap-2">
                        <h1 className="font-bold text-xl">Notifications</h1>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-2 w-11/12 h-auto border-2 {notification.is_read === false ? 'border-red-600' : 'border-slate-100'} bg-slate-100 rounded-lg flex`}
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

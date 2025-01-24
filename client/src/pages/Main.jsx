import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setTheme } from '../redux/theme/themeSlice';
import { persistor } from '../redux/store';
import { logout, setUserProfile } from '../redux/user/userSlice';
import axios from 'axios';
import { clearAssignment, setCAssignment } from '../redux/assignment/assignmentSlice';
import { clearChallegneS, setChallengeS } from '../redux/challenges/challengesSlice';
import { clearAchievement, setAchievement } from '../redux/achievement/achievementSlice';
import Calendar from "./Calendar";
// import '../style/Main.css'

const Main = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);
    const [isNotification, setIsNotification] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [profileT, setProfileT] = useState(false);

    const [dueAssignments, setDueAssignment] = useState([{}]);
    const [dueChallenges, setDueChallenges] = useState([{}]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/assignment', {
                    withCredentials: true,
                });

                const fetchedAssignments = res.data.assignments || [];

                // console.log(res.data.assignments);

                const dueDates = fetchedAssignments.filter(assignment => assignment.due_date).map(assignment => ({
                    date: new Date(assignment.due_date).toLocaleDateString(),
                    status: assignment.status
                }));
                setDueAssignment(dueDates);

                // console.log(dueDates);

                dispatch(setCAssignment(fetchedAssignments)); // Dispatch after setting state
            } catch (error) {
                if (error.response?.status === 404) {
                    // setAssignments([]);
                    dispatch(setCAssignment([])); // Clear Redux state if no assignments found
                } else {
                    console.error('Error fetching assignments:', error.response?.message);
                }
            }
        };

        const getChallenges = async () => {
            try {
                const res = await axios.get("http://localhost:5000/challenges/accepted", {
                    headers: {
                        coordinator: "true" // Include the required header
                    },
                    withCredentials: true
                })

                // setChallenges(res.data.challenges);
                const dueDates = res.data.challenges.filter(challenge => challenge.end_date).map(challenge =>
                ({
                    date: new Date(challenge.end_date).toLocaleDateString(),
                    status: challenge.participantDetails?.status
                }));

                setDueChallenges(dueDates);
                dispatch(setChallengeS(res.data.challenges));
                // console.log(res.data.challenges);
            }
            catch (err) {
                console.error("Error fetching challenges:", err.response?.data?.message || err.message);
            }
        }

        const getAchievements = async () => {
            try {
                const res = await axios.get('http://localhost:5000/achievement/achievements/', { withCredentials: true })

                // console.log("Achievements : ", res.data.achievements.achievements);

                dispatch(setAchievement(res.data.achievements.achievements));
            }
            catch (err) {
                console.log("Error in fetching achievements : ", err.response?.data?.message || err.message);
            }
        }

        const getUserProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/user/profile', {
                    withCredentials: true, // Include cookies in the request
                });
                const data = res.data;

                // console.log(data);

                if (res) {
                    // setSuccess("Login Successfull");

                    dispatch(setUserProfile({
                        name: data.name,
                        reg_no: data.reg_no,
                        email: data.email,
                        password: data.password,
                        aura_points: data.aura_points
                    }));

                    // navigate("/main");
                }
                else {
                    // setError(data.message || "Login Failed");
                }
            }
            catch (err) {
                // setError(err.response.data.message || "An error occurred")
            }
        }

        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/notifications/", {
                    withCredentials: true
                })

                // console.log(res.data);

                setNotifications(res.data.notifications);
            }
            catch (err) {
                console.log("Error in fetchNotifications controller", err.message);
            }
        }

        fetchNotifications();
        getChallenges();
        fetchAssignments();
        dueAssignmentHandler(); // Call the function
        getAchievements();
        auraLevelHandler();
        getUserProfile();
        // fetchHolidays();
    }, [dispatch, currentUser, notifications]);


    const cassignment = useSelector((state) => state.cassignment.cassignment)
    const challengeS = useSelector((state) => state.challengeS.challengeS)
    const achievement = useSelector((state) => state.achievement.achievement);

    // console.log(assignments)

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    }

    const profileToggle = () => {
        setProfileT(!profileT);
    }

    const logoutHandle = () => {
        // Clear Redux state
        dispatch(logout());
        dispatch(clearAssignment());
        dispatch(clearChallegneS());
        dispatch(clearAchievement());

        // Purge persisted data
        persistor.purge();

        // console.log(cassignment)
    }

    const dueAssignmentHandler = () => {
        let cnt = 0;

        // Iterate over the assignments and count those with "pending" status
        cassignment.forEach((assignment) => {
            if (assignment.status === "Pending") {
                cnt++;
            }
        });

        // console.log(cnt);

        return cnt; // Return the count of pending assignments
    };

    const dueChallengesHandler = () => {
        // console.log(achievement);
        let cnt = 0;

        challengeS.forEach((challenge) => {
            if (challenge.participantDetails?.status === 'in-progress') cnt++;
        })

        return cnt;
    }

    const markNotification = async (id) => {
        console.log(id);
        try {
            const res = await axios.patch("http://localhost:5000/notifications/mark-read", { id }, {
                withCredentials: true,
            })

            // console.log(res.data);
        }
        catch (err) {
            console.log("Error in markNotification", err);
        }
    }

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

    const navigate = useNavigate();

    return (
        <div>
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
                                <span onClick={() => setIsNotification(true)} className="material-icons">Notifications</span>
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
                                        <Link to="/signin" onClick={logoutHandle} className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</Link>
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
                            <div className="mt-2 text-gray-600">Current Aura Level: {level}</div>
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
                        </div >

                        {/* Quick Stats */}
                        < div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3" >
                            <div className="p-4 bg-white border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
                                <p>{dueAssignmentHandler()} assignments due this week</p>
                            </div>
                            <div className="p-4 bg-white border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">Challenges in Progress</h3>
                                <p>{dueChallengesHandler()} challenges to complete</p>
                            </div>
                            <div className="p-4 bg-white border rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">Recent Achievements</h3>
                                {
                                    achievement.slice(0, 3)
                                        .map((achievements) => (
                                            <li key={achievements._id}>
                                                <span className="text-xs">{achievements.description}</span>
                                            </li>
                                        ))
                                }

                                <button onClick={() => navigate("/achievement-tracking")}
                                    className="mt-2 px-2 py-1 rounded-lg mb-2 bg-blue-500 hover:bg-blue-400 text-white text-xs"
                                >
                                    See More
                                </button>
                            </div>
                        </div >

                        {/* Calendar View and Active Challenges */}
                        < div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6" >
                            {/* Calendar View */}
                            < div className="p-4 bg-white border rounded-lg shadow-sm" >
                                <h3 className="text-lg font-semibold">Calendar</h3>
                                {/* Example Calendar View */}
                                <Calendar dueAssignments={dueAssignments} dueChallenges={dueChallenges} />
                            </div >

                            {/* Active Challenges */}
                            < div className="p-4 bg-white border rounded-lg shadow-sm" >
                                <h3 className="text-lg font-semibold">Active Challenges</h3>
                                <div className="mt-2">
                                    {
                                        challengeS.filter((challenge) => challenge.participantDetails?.status === 'in-progress')
                                            .map((challenge) => (
                                                <li key={challenge._id}>
                                                    <span>{challenge.title}</span>
                                                </li>
                                            ))
                                    }
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


            {/* Notifation box */}
            {
                isNotification &&
                (
                    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
                        <div className='p-4 h-5/6 w-3/4 bg-white border rounded-lg shadow-sm flex flex-col gap-2'>
                            <h1 className='font-bold text-xl'>Notifications</h1>

                            {
                                notifications.map((notification) => (
                                    <div key={notification._id} className={`p-2 w-9/10 h-1/8 border-2
                                     ${notification.is_read === false ? `border-red-600` : `border-slate-100`} bg-slate-100 rounded-lg
                                     flex`}>
                                        <div>
                                            <h4 className='text-sm font-semibold'>Title : {notification.title}</h4>
                                            <span className='text-sm'>{notification.message}</span>
                                        </div>

                                        <button onClick={() => {
                                            console.log("Button clicked!");
                                            markNotification(notification._id);
                                        }} className='z-100 p-1 px-2 ml-auto mt-auto text-xs
                                         bg-blue-400 rounded-lg'>
                                            {notification.is_read === false ? "Mark As Read" : "Already Read"}
                                        </button>
                                    </div>
                                ))
                            }

                            <button onClick={() => setIsNotification(false)} 
                            className='bg-blue-400 w-1/6 p-1 py-2 mt-auto mx-auto rounded-lg'>Close Notifications</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Main;

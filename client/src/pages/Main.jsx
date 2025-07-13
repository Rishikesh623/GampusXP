import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { persistor } from '../redux/store';
import { logout, setUserProfile } from '../redux/user/userSlice';
import axios from 'axios';
import { clearAssignment, setCAssignment } from '../redux/assignment/assignmentSlice';
import { clearChallenges, setChallenges } from '../redux/challenges/challengesSlice';
import { clearAchievement, setAchievement } from '../redux/achievement/achievementSlice';
import Calendar from "../components/Calendar"
import LeftDrawer from '../components/LeftDrawer';
import NavBar from '../components/NavBar';
import { setTimeTable } from '../redux/timetable/timetableSlice';
import { useToast } from '../components/ToastProvider';

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

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
    const [recentActivities, setRecentActivities] = useState([]);

    // Redux state slices
    const cassignment = useSelector((state) => state.cassignment.cassignment);
    const challenges = useSelector((state) => state.challenges.challenges);
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
            }
            catch (err) {
                if (err.response?.status === 404) {
                    dispatch(setCAssignment([]));
                    return;
                }
                showToast({ message: err.response?.data?.message || "Something went wrong while fetching assignments . Please contact on help.", type: "error" });
            }
        };

        const getChallenges = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/challenges/accepted`, {
                    withCredentials: true
                });
                const dueDates = res.data.challenges
                    .filter(challenge => challenge.end_date)
                    .map(challenge => ({
                        date: new Date(challenge.end_date).toLocaleDateString(),
                        status: challenge.participantDetails?.status
                    }));
                setDueChallenges(dueDates);
                dispatch(setChallenges(res.data.challenges));
            } catch (err) {
                if (err.response?.status === 404) {
                    return;
                }
                showToast({ message: err.response?.data?.message || "Something went wrong while fetching challenges info. Please contact on help.", type: "error" });
            }
        };

        const getAchievements = async () => {
            try {
                if (achievement.length !== 0) {
                    return;
                }
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/achievements`, { withCredentials: true });
                if (res.data.achievements)
                    dispatch(setAchievement(res.data.achievements));
            }
            catch (err) {
                if (err.response?.status === 404) {
                    return;
                }
                showToast({ message: err.response?.data?.message || "Something went wrong while fetching achievements. Please contact on help.", type: "error" });
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
                        aura_points: data.aura_points,
                        showRecentActivity: data.showRecentActivity
                    }));
                    console.log(currentUser);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    return;
                }
                showToast({ message: err.response?.data?.message || "Something went wrong while fetching user Info . Please contact on help.", type: "error" });
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
            }
            catch (err) {
                if (err.response?.status === 404) {
                    return;
                }
                showToast({ message: err.response?.data?.message || "Notifications load error. Please contact on help.", type: "error" });
            }
        };

        const getTodaysTImetable = async () => {

            if (!todaysTimetable || Object.keys(todaysTimetable).length === 0) {
                // Get current day
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDay = days[new Date().getDay()];

                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/timetable/${currentDay}`, {
                        withCredentials: true,
                    });
                    if (res.data) {
                        setTodaysTimetable(res.data.days[0]);
                        dispatch(setTimeTable({ ctimetable: res.data.days }));
                    }
                }
                catch (err) {
                    if (err?.response?.status === 404) {
                        return;
                    }
                    showToast({ message: err.response?.data?.message || "Something went wrong while fetching timetable . Please contact on help.", type: "error" });
                }
            }

        }

        const getRecentActivities = async () => {
            if (!recentActivities || recentActivities.length === 0) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/activity`, {
                        withCredentials: true,
                    });
                    if (res.data) {
                        setRecentActivities(res.data.activities);
                    }
                }
                catch (err) {
                    if (err?.response?.status === 404) {
                        return;
                    }
                    showToast({ message: err.response?.data?.message || "Something went wrong while fetching recent activities . Please contact on help.", type: "error" });
                }
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
        getRecentActivities();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    const profileToggle = () => {
        setProfileT(!profileT);
    };

    const logoutHandle = () => {

        async function logOut() {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/logout`, {}, {
                    withCredentials: true
                });

                dispatch(logout());
                dispatch(clearAssignment());
                dispatch(clearChallenges());
                dispatch(clearAchievement());
                persistor.purge();
                showToast({ message: res.data.message, type: "success" });
            } catch (error) {
                if (error.response) {
                    showToast({ message: error.response.data.message || "Something went wrong!", type: "error" });
                } else if (error.request) {
                    showToast({ message: "No response from server. Check your connection.", type: "error" });
                } else {
                    showToast({ message: "Unexpected error occurred.", type: "error" });
                }
            }
        }

        logOut()

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
        challenges.forEach((challenge) => {
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
        }
        catch (err) {
            if (err.response?.status === 404) {
                return;
            }
            showToast({ message: err.response?.data?.message || "Something went wrong . Please contact on help.", type: "error" });
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

                <NavBar
                    currentTheme={currentTheme}
                    handleThemeChange={handleThemeChange}
                    setIsNotification={setIsNotification}
                    unReadNotificationsCount={unReadNotificationsCount}
                    profileToggle={profileToggle}
                    logoutHandle={logoutHandle}
                />

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
                                    (!achievement || achievement.length === 0) ? (
                                        <p className="text-sm text-base-content">
                                            No Achievements yet.
                                        </p>
                                    ) : (
                                        <>
                                            <ul className="list-disc ml-4 text-sm text-base-content">
                                                {achievement.slice(0, 3).map((achievements) => (
                                                    <li key={achievements._id} className="text-xs">{achievements.description}</li>
                                                ))}
                                            </ul>
                                            <div className="flex justify-end">
                                                {achievement.length > 3 && (
                                                    <button
                                                        onClick={() => navigate("/achievements")}
                                                        className="btn btn-xs btn-primary mt-2"
                                                    >
                                                        See More
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )
                                }
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

                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-4 w-full max-w-5xl mx-auto">
                                {/* Calendar Section */}
                                <div className="sm:border-r sm:pr-6 pb-6 sm:pb-0 w-full sm:w-1/2">
                                    <Calendar dueAssignments={dueAssignments} dueChallenges={dueChallenges} />
                                </div>

                                {/* Timetable Section */}
                                <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm w-full sm:w-1/2">

                                    {todaysTimetable?.slots?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {todaysTimetable.slots.map((slot, index) => (
                                                <li
                                                    key={index}
                                                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                                                >
                                                    <span className="text-gray-800 font-medium text-sm">{slot.time}</span>
                                                    <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-md font-semibold">
                                                        {slot.course}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-gray-600 text-sm italic">No classes today 🎉</div>
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
                                    <h4 className="text-md mb-2 font-semibold text-secondary flex items-center gap-2">
                                        🚀 Challenges
                                    </h4>
                                    {
                                        (challenges !== undefined && challenges.length !== 0) ? (
                                            <ul className="mt-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
                                                {challenges.filter(challenge => challenge.participantDetails?.status === 'in-progress')
                                                    .map(challenge => (
                                                        <li key={challenge._id} className="text-sm py-1 border-b last:border-none hover:text-blue-500">
                                                            {challenge.title}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        ) : (
                                            <div className="text-gray-600 text-sm italic">Currently no Challenges  </div>
                                        )
                                    }

                                </div>

                                {/* Recent Activities (Right Side) */}
                                <div className="w-1/2 min-h-[230px] bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                                    <h4 className="text-md mb-2 font-semibold text-secondary flex items-center gap-2">
                                        🔄 Recent Activities
                                    </h4>
                                    {recentActivities && recentActivities.length > 0 ? (
                                        <div className="mt-3">
                                            <ul className="space-y-2">
                                                {recentActivities.slice(0, 4).map((activity) => (
                                                    <li
                                                        key={activity._id}
                                                        className="text-sm text-gray-700 py-1 border-b border-gray-300 last:border-none"
                                                    >
                                                        {activity.message}
                                                    </li>
                                                ))}
                                            </ul>
                                            {recentActivities.length > 4 && (
                                                <button className="mt-2 text-primary text-sm font-medium hover:underline" onClick={() => navigate('/activity')}>
                                                    See more
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm italic mt-3">No recent activity</div>
                                    )}

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

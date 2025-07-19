import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../components/NotficationModal';
import ModifyRegNoModal from '../components/ModifyRegNoModal'; // Correct path



import { useToast } from "../components/ToastProvider";
import axios from "axios";


const Coordinator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { showToast } = useToast();

    // for reg no modify 
    const [modifyRegModalOpen, setModifyRegModalOpen] = useState(false);

    // Modal & notifications state
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications at reload    
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/notifications/`, {
                    withCredentials: true,
                });
                setNotifications(res.data.notifications);
                const cnt = res.data.notifications.filter(nt => nt.is_read === false).length;
                setUnreadCount(cnt);
            } catch (err) {
                if (err.response?.status === 404) {
                    setNotifications([]);
                    setUnreadCount(0);
                    return;
                }
                showToast?.({
                    message: err.response?.data?.message || "Notifications load error. Please contact on help.",
                    type: "error",
                });
            }
        };
        fetchNotifications();
    }, []);

    const handleNotifications = () => {
        setNotificationOpen(true);
    };

    const logoutHandler = () => {
        dispatch(logout());
        persistor.purge();
        navigate("/signin");
    };

    const coordinatorTools = [
        { path: "/coordinator/course-management", label: "📚 Manage Courses" },
        { path: "/coordinator/challenges-management", label: "🎯 Manage Challenges" },
        { path: "MODAL_modifyReg", label: "🖉 Update student Reg. No." },
    ];

    const mainUILinks = [
        { path: "/main", label: "🏠 Main User Home" },
        { path: "/profile", label: "👤 Your Profile" },
        { path: "/other-user-profile", label: "👥 Other User Profile" },
        { path: "/course-management-user", label: "📘 User Course Page" },
        { path: "/assignment-tracking", label: "📝 Assignment Tracking" },
        { path: "/achievement-tracking", label: "🏆 Achievement Tracking" },
        { path: "/leaderboards", label: "📊 Leaderboards" },
        { path: "/rewards-challenges", label: "🎁 Rewards & Challenges" },
        { path: "/proposed-challenges", label: "🧪 Proposed Challenges" },
        { path: "/accepted-challenges", label: "✅ Accepted Challenges" },
        { path: "/timetable", label: "📅 Timetable" },
        { path: "/settings", label: "⚙️ Settings" },
        { path: "/", label: "🌐 Public Home Page" },
    ];

    return (
        <>
            <div data-theme="light" className="min-h-screen bg-base-100 px-8">
                <div className="space-y-12">
                    {/* Header */}
                    <div className="relative flex items-center h-20 px-4">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <img
                                src="/logo.png"
                                alt="GampusXP"
                                className="h-16 w-auto bg-white rounded p-1"
                            />
                        </div>

                        {/* Title */}
                        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-center">
                            Coordinator Dashboard
                        </h1>

                        {/* Right Buttons */}
                        <div className="ml-auto flex items-center gap-2">
                            {/* Notifications Button (opens modal) */}
                            <button
                                onClick={handleNotifications}
                                className="btn btn-sm btn-outline"
                            >
                                Notifications
                                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </button>
                            <button onClick={logoutHandler} className="btn btn-sm btn-outline">
                                Logout
                            </button>
                        </div>
                    </div>



                    {/* Coordinator Tools */}
                    <section>
                        <h2 className="text-2xl font-medium mb-2">Coordinator Tools</h2>
                        <p className="text-sm text-gray-600 mb-4">Manage platform content and challenges</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {coordinatorTools.map(({ path, label }) =>
                                path.startsWith("MODAL_") ? (
                                    <button
                                        key={path}
                                        className="btn btn-outline justify-start w-full"
                                        onClick={() => setModifyRegModalOpen(true)}
                                    >
                                        {label}
                                    </button>
                                ) : (
                                    <Link
                                        key={path}
                                        to={path}
                                        className="btn btn-outline justify-start w-full"
                                    >
                                        {label}
                                    </Link>
                                )
                            )}
                        </div>
                    </section>

                    {/* Main App UI Links */}
                    <section>
                        <h2 className="text-2xl font-medium mb-2">Main App UI Access</h2>
                        <p className="text-sm text-gray-600 mb-4">View how users see various sections</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {mainUILinks.map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className="btn btn-outline justify-start w-full"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            {/* Notifications Modal */}
            <NotificationModal
                open={notificationOpen}
                notifications={notifications}
                setNotifications={setNotifications}
                setUnreadCount={setUnreadCount}
                onClose={() => setNotificationOpen(false)}
            />
            {/* Modify Reg NO Modal */}
            <ModifyRegNoModal
                open={modifyRegModalOpen}
                onClose={() => setModifyRegModalOpen(false)}
            />
        </>
    );
};

export default Coordinator;

// NotificationModal.jsx
import axios from "axios";
import { useToast } from "./ToastProvider";

const NotificationModal = ({ open, notifications, setNotifications, setUnreadCount, onClose }) => {
    const loading = false;
    const { showToast } = useToast();
    // Mark notification as read
    const markNotification = async (id) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/notifications/mark-read`,
                { notificationId: id },
                { withCredentials: true }
            );
            setNotifications((prev) =>
                prev.map((nt) => (nt._id === id ? { ...nt, is_read: true } : nt))
            );
            setUnreadCount(prev => prev - 1);
        } catch (err) {
            if (err.response?.status === 404) return;
            showToast?.({
                message: err.response?.data?.message || "Something went wrong. Please contact on help.",
                type: "error",
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                <button
                    className="absolute top-2 right-3 text-gray-600 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>🔔</span> Notifications
                </h2>
                {loading ? (
                    <div className="py-10 text-center text-gray-500">Loading...</div>
                ) : notifications.length ? (
                    <ul className="space-y-4 max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                            <li
                                key={n._id}
                                onClick={() => !n.is_read && markNotification(n._id)}
                                className={`rounded-lg border px-4 py-2 cursor-pointer ${n.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-400'}`}
                            >
                                <div className="font-medium flex items-center gap-1">
                                    {n.title}
                                    {!n.is_read && (
                                        <span className="ml-2 inline-block rounded-full bg-blue-500 w-2 h-2"></span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700">{n.message}</div>
                                {!n.is_read && (
                                    <span className="text-xs text-blue-600 font-semibold">Mark as read</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="py-10 text-center text-gray-500">No notifications</div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;

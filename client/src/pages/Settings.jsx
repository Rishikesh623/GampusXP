import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateEmail, updateShowRecentActivityFlag } from '../redux/user/userSlice';
import { FaEye, FaEyeSlash, FaEdit, FaCheck } from "react-icons/fa";
import { useToast } from '../components/ToastProvider';
import axios from "axios";
import Layout from "../components/Layout";

const Settings = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);

    // State for modals and forms
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [regRequest, setRegRequest] = useState({ newRegNo: "", message: "" });
    const [regLoading, setRegLoading] = useState(false);


    // Notification state
    const { showToast } = useToast();

    // Form states
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [email, setEmail] = useState(currentUser.email);
    const [showRecentActivity, setShowRecentActivity] = useState(
        currentUser.showRecentActivity ?? true
    );
    // Handle input changes
    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };
    const handleEmailChange = (e) => setEmail(e.target.value);

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // API: PATCH /profile/edit
    const updateProfile = async (payload, successMsg) => {
        setLoading(true);
        try {
            await axios.patch(
                `${process.env.REACT_APP_BASE_URL}/user/profile/edit`,
                payload,
                { withCredentials: true }
            );
            showToast({ message: successMsg, type: 'success' });
            return true;
        } catch (err) {
            showToast({ message: err.response?.data?.message || "An error occurred.", type: 'error' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Handle Password Change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            showToast({ message: "Passwords do not match.", type: 'error' });
            return;
        }

        try {
            const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/change-password`, password, {
                withCredentials: true,
            });

            if (res.status === 200) {
                showToast({ message: "Password updated successfully!", type: 'success' });
            }
        } catch (err) {
            showToast({ message: err.response?.data?.message || "An error occurred.", type: 'error' });
        }
    };

    // Handle Email Update
    const handleEmailUpdate = async () => {
        if (email === currentUser.email) {
            setIsEmailEditing(false);
            return;
        }
        if (!email.includes("@")) {
            showToast({ message: "Enter a valid email.", type: 'error' });
            return;
        }
        const success = await updateProfile({ email }, "Email updated!");
        if (success) {
            setIsEmailEditing(false);
            dispatch(updateEmail(email));
        }
    };

    // Handle reg_no change request
    const handleRegRequest = async (e) => {
        e.preventDefault();
        setRegLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/notifications/registration-change-request`, {
                oldRegNo: currentUser.reg_no,
                newRegNo: regRequest.newRegNo,
                message: regRequest.message,
            }, { withCredentials: true });
            showToast({ message: "Request sent to coordinator!", type: 'success' });
            setIsRegModalOpen(false);
            setRegRequest({ newRegNo: "", message: "" });
        } catch (err) {
            console.log(err);
            setIsRegModalOpen(false);
            showToast({ message: err.response?.data?.message || "Error sending request.", type: 'error' });
        } finally {
            setRegLoading(false);
        }
    };

    // Handle Show Recent Activity Toggle
    const handleActivityToggle = async () => {
        const newValue = !showRecentActivity;
        const success = await updateProfile(
            { showRecentActivity: newValue },
            `Recent activity is now ${newValue ? "visible" : "hidden"}`
        );
        if (success) {
            setShowRecentActivity(newValue);
            dispatch(updateShowRecentActivityFlag(newValue));
        }
    };

    return (
        <Layout screenHeight={true} title="⚙️ Settings">
            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Account Settings */}
                <section className="p-6 bg-white shadow-xl rounded-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>👤</span>
                        <span>Account Information</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4">

                        {/* Email */}
                        <div className="md:col-span-3 flex items-center font-medium text-gray-700">
                            Email:
                        </div>
                        <div className="md:col-span-9 flex items-center">
                            {isEmailEditing ? (
                                <>
                                    <input
                                        type="email"
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-60 focus:ring-2 focus:ring-blue-400 focus:outline-none mr-2"
                                        value={email}
                                        onChange={handleEmailChange}
                                        disabled={loading}
                                    />
                                    <button
                                        className="bg-green-500 text-white rounded-lg px-3 py-2 mr-1 hover:bg-green-600 flex items-center"
                                        onClick={handleEmailUpdate}
                                        disabled={loading}
                                        title="Save"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        className="bg-gray-300 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-400 flex items-center"
                                        onClick={() => {
                                            setEmail(currentUser.email);
                                            setIsEmailEditing(false);
                                        }}
                                        disabled={loading}
                                        title="Cancel"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-900 font-mono">{email}</span>
                                    <button
                                        className="ml-3 text-blue-600 hover:text-blue-800 flex items-center"
                                        onClick={() => setIsEmailEditing(true)}
                                        title="Edit Email"
                                    >
                                        <FaEdit />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Registration Number */}
                        <div className="md:col-span-3 flex items-center font-medium text-gray-700">
                            Registration No.
                        </div>
                        <div className="md:col-span-9 flex items-center">
                            <span className="text-gray-900 font-mono">{currentUser.reg_no}</span>
                            <button
                                className="ml-4 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm font-semibold transition flex items-center"
                                onClick={() => setIsRegModalOpen(true)}
                                title="Request Registration No. Change"
                            >
                                Change Registration No.
                            </button>
                        </div>

                        {/* Change Password */}
                        <div className="md:col-span-9">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition flex items-center"
                                onClick={() => setIsPasswordModalOpen(true)}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </section>



                {/* Privacy Settings */}
                <section className="p-6 bg-white shadow-xl rounded-xl">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🔒</span> Privacy Settings
                    </h2>
                    <div className="flex items-center justify-between">
                        <span>Show recent activity on my profile</span>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                                checked={showRecentActivity}
                                onChange={handleActivityToggle}
                                disabled={loading}
                            />
                            <span className="ml-2 text-gray-700">
                                {showRecentActivity ? "On" : "Off"}
                            </span>
                        </label>
                    </div>
                </section>

                {/* Notification Preferences */}
                <section className="p-6 bg-white shadow-xl rounded-xl">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span>🔔</span> Notification Preferences
                    </h2>
                    <div className="text-gray-400 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Email Notifications</span>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs ml-2">Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">SMS Notifications</span>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs ml-2">Coming Soon</span>
                        </div>
                    </div>
                </section>

                {/* Password Modal */}
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <form
                            className="bg-white p-8 w-96 rounded-xl shadow-2xl animate-fadeIn"
                            onSubmit={handlePasswordSubmit}
                        >
                            <h3 className="text-2xl font-bold mb-6 text-center">🔑 Change Password</h3>
                            {["oldPassword", "newPassword", "confirmPassword"].map((field, idx) => (
                                <div className="mb-5" key={idx}>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">
                                        {field === "oldPassword"
                                            ? "Current Password"
                                            : field === "newPassword"
                                                ? "New Password"
                                                : "Confirm New Password"}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords[field] ? "text" : "password"}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            placeholder={
                                                field === "oldPassword"
                                                    ? "Enter current password"
                                                    : "Enter new password"
                                            }
                                            name={field}
                                            value={password[field]}
                                            onChange={handlePasswordChange}
                                            disabled={loading}
                                        />
                                        <span
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                                            onClick={() => togglePasswordVisibility(field)}
                                        >
                                            {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Registaction no. change contact coordinator Modal  */}
                {isRegModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <form
                            className="bg-white p-8 w-102 rounded-xl shadow-2xl animate-fadeIn"
                            onSubmit={handleRegRequest}
                        >
                            <h3 className="text-2xl font-bold mb-6 text-center">❗ Registration No. Update</h3>

                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    New Registration Number
                                </label>
                                <input
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    value={regRequest.newRegNo}
                                    onChange={e => setRegRequest({ ...regRequest, newRegNo: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Message (optional)
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    value={regRequest.message}
                                    onChange={e => setRegRequest({ ...regRequest, message: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setIsRegModalOpen(false)}
                                    disabled={regLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                                    disabled={regLoading}
                                >
                                    {regLoading ? "Sending..." : "Send Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Settings;

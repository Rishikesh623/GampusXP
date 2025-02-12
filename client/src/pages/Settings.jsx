import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Layout from "../components/Layout";

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [notification, setNotification] = useState({ type: "", text: "" });

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            setNotification({ type: "error", text: "Passwords do not match." });
            return;
        }

        try {
            const res = await axios.patch(`${process.env.BASE_URL}/user/change-password`, password, {
                withCredentials: true,
            });

            if (res.status === 200) {
                setNotification({ type: "success", text: "Password updated successfully!" });
                setTimeout(() => setIsModalOpen(false), 2000);
            }
        } catch (err) {
            setNotification({ type: "error", text: err.response?.data?.message || "An error occurred." });
        }
    };

    return (
        <Layout title="⚙️ Settings">
            <div className="p-6 max-w-2xl mx-auto">
                {notification.text && (
                    <div className={`text-center py-2 rounded-lg ${notification.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                        {notification.text}
                    </div>
                )}


                {/* Account Settings */}
                <div className="p-5 bg-white shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
                    <p className="text-gray-700">📧 Email: <strong>{currentUser.email}</strong></p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Change Password
                    </button>
                </div>

                {/* Notification Preferences */}
                <div className="p-5 bg-white shadow-lg rounded-lg mt-6">
                    <h2 className="text-xl font-semibold mb-3">🔔 Notification Preferences</h2>
                    <label className="flex items-center space-x-3">
                        <input type="checkbox" className="form-checkbox text-blue-500" defaultChecked />
                        <span>Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3 mt-2">
                        <input type="checkbox" className="form-checkbox text-blue-500" />
                        <span>SMS Notifications</span>
                    </label>
                </div>

                {/* Change Password Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <form
                            className="bg-white p-6 w-96 rounded-lg shadow-lg animate-fadeIn"
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-2xl font-semibold mb-4">🔑 Change Password</h3>

                            {["oldPassword", "newPassword", "confirmPassword"].map((field, idx) => (
                                <div className="mb-4" key={idx}>
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
                                            placeholder={field === "oldPassword" ? "Enter current password" : "Enter new password"}
                                            name={field}
                                            value={password[field]}
                                            onChange={handleChange}
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

                            {notification.text && (
                                <p className={`text-center font-medium mt-3 ${notification.type === "error" ? "text-red-500" : "text-green-500"}`}>
                                    {notification.text}
                                </p>
                            )}

                            <div className="flex justify-end mt-4 space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                                >
                                    Save Changes
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

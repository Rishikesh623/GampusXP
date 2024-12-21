import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../redux/user/userSlice';
import { current } from '@reduxjs/toolkit';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    const [showNotification, setShowNotification] = useState(false);

    // Function to open the modal
    const openModal = () => setIsModalOpen(true);

    // Function to close the modal
    const closeModal = () => setIsModalOpen(false);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const onChangeForm = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (password.newPassword !== password.confirmPassword) {
            setError("Password and Confirm Password doesn't match.");
            return;
        }

        try {
            const res = await axios.patch('http://localhost:5000/user/change-password', password, {
                withCredentials: true
            });

            if (res.status === 200) {
                setSuccess("Password Updated");
                setShowNotification(true); // Show notification
                setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
                closeModal();
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field],
        });
    };

    return (
        <div className="p-6">
            {showNotification && ( // Notification popup
                <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-3 z-50">
                    Password changed successfully!
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Settings</h1>

            <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <p>Email: {currentUser.email}</p>
                <button
                    className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                    onClick={openModal}
                >
                    Change Password
                </button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Notification Preferences</h2>
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" defaultChecked />
                    <span>Email Notifications</span>
                </label>
                <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>SMS Notifications</span>
                </label>
            </div>

            {/* Modal for changing password */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <form className="bg-white p-6 rounded-lg shadow-lg w-96" onSubmit={onSubmitForm}>
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>

                        {["oldPassword", "newPassword", "confirmPassword"].map((field, idx) => (
                            <div className="mb-4" key={idx}>
                                <label className="block text-sm">
                                    {field === "oldPassword"
                                        ? "Current Password"
                                        : field === "newPassword"
                                            ? "New Password"
                                            : "Confirm New Password"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords[field] ? "text" : "password"}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder={
                                            field === "oldPassword"
                                                ? "Enter current password"
                                                : field === "newPassword"
                                                    ? "Enter new password"
                                                    : "Confirm new password"
                                        }
                                        name={field}
                                        value={password[field]}
                                        onChange={onChangeForm}
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => togglePasswordVisibility(field)}
                                    >
                                        {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {success && <p className="text-green-500 text-center">{success}</p>}

                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button type='submit' className="px-4 py-2 bg-blue-600 text-white rounded">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Settings;

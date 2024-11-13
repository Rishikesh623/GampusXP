import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../redux/user/userSlice';

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => setIsModalOpen(true);

    // Function to close the modal
    const closeModal = () => setIsModalOpen(false);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const onChangeForm = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const onSubmitForm = (e) => {
        e.preventDefault();

        if (password.currentPassword !== currentUser.password) {
            setError("Current password is wrong!!");
        }
        else {
            if (password.newPassword !== password.confirmPassword) {
                setError("Password and Confirm Password doesn't match.");
            }
            else {
                dispatch(updatePassword(password.newPassword));
                setSuccess("Password Updated");
            }
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>

            <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <p>Email: user@example.com</p>
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

                        <div className="mb-4">
                            <label className="block text-sm">Current Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter current password"
                                name="currentPassword"
                                value={password.currentPassword}
                                onChange={onChangeForm}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">New Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter new password"
                                name='newPassword'
                                value={password.newPassword}
                                onChange={onChangeForm}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Confirm new password"
                                name='confirmPassword'
                                value={password.confirmPassword}
                                onChange={onChangeForm}
                            />
                        </div>

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

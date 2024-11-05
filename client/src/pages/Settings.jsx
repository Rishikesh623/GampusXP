import React from 'react';

const Settings = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            
            <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold">Account Settings</h2>
                <p>Email: user@example.com</p>
                <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Change Password</button>
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
        </div>
    );
};

export default Settings;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { updateAbout, updateEmail, updateRegNo } from '../redux/user/userSlice';
import axios from "axios";
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useToast } from './ToastProvider';

const ProfileView = ({ other, currentUser, achievements, recentActivities, hiddenActivityMsg }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const sortedAchievements = [...achievements].sort(
        (a, b) => new Date(b.completionDate) - new Date(a.completionDate)
    );
    const [formData, setFormData] = useState({
        reg_no: currentUser.reg_no || "",
        name: currentUser.name || "",
        email: currentUser.email || "",
        about: currentUser.about || ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [level, setLevel] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    useEffect(() => {
        setFormData({
            reg_no: currentUser.reg_no,
            name: currentUser.name,
            email: currentUser.email,
            about: currentUser.about || ""
        });
        const auraLevelHandler = () => {
            const md = 1000;
            const aura = currentUser.aura_points;
            const currentLevel = Math.floor(aura / md);
            const progressWithinLevel = (aura % md) / md;
            setLevel(currentLevel);
            setProgressPercentage(progressWithinLevel * 100);
        };

        auraLevelHandler();

    }, [currentUser]);

    const onChangeEditForm = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/profile/edit`, formData, { withCredentials: true });
            const data = res.data;
            if (!res) return;
            dispatch(updateRegNo(data.reg_no));
            dispatch(updateEmail(data.email));
            dispatch(updateAbout(data.about));

            showToast({ message: "Updated successfully", type: 'success' });
            setFormData({ reg_no: data.reg_no, name: data.name, email: data.email, about: data.about });
        } catch (err) {
            showToast({ message: "Internal server error" || err.response.data.message , type: 'error' });
        }
        setIsModalOpen(false);
    };

    return (
        <Layout screenHeight="true" title="ProfileView">
            <div className="min-h-scrren bg-gray-50" data-theme="light">

                {/* Top Banner */}
                <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 text-white py-9 rounded-b-3xl shadow-md animate-fade-in">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between ">
                        <div>
                            <h1 className="text-4xl font-bold">{!other && "My"} ProfileView</h1>
                            <p className="h-6">            </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <p className="text-lg font-medium">
                                {!other && "Welcome back,"} <span className="font-semibold">{currentUser.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-2 md:px-8 -mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 z-100 relative">

                    {/* ProfileView Card */}
                    <div className="card shadow-xl bg-white rounded-2xl">
                        <div className="card-body items-center text-center">
                            <div className="avatar online">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="/profile_picture.jpg" alt="ProfileView" />
                                </div>
                            </div>
                            <h2 className="card-title mt-2">{currentUser.name}</h2>
                            <p className="text-sm text-gray-500">{currentUser.reg_no}</p>

                            <div className="stats shadow mt-2 ">
                                <div className="stat">
                                    <div className="stat-title">Id</div>
                                    <div className="stat-value text-sm">{currentUser.reg_no}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Email</div>
                                    <div className="stat-value text-sm">{currentUser.email}</div>
                                </div>
                            </div>

                            <div className="w-full mt-4">
                                <div className="border rounded-xl p-4 text-sm bg-white">
                                    <p className="text-gray-500 font-medium mb-2">About</p>
                                    <p className="text-gray-700">
                                        {currentUser.about || (
                                            <span className="text-gray-400 flex items-center gap-1">—</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2 w-full min-h-[80px]">
                                {!other ? (
                                    <>
                                        <button
                                            className="btn btn-primary btn-sm w-full shadow hover:shadow-md transition"
                                            onClick={() => setIsModalOpen(true)}
                                            aria-label="Edit ProfileView"
                                        >
                                            Edit ProfileView
                                        </button>
                                        <button
                                            className="btn btn-outline btn-sm w-full hover:bg-blue-50 hover:text-blue-600 transition"
                                            aria-label="Upload Photo"
                                            onClick={() => alert("Not implemented yet.")}
                                        >
                                            Upload Photo
                                        </button>
                                    </>
                                ) : (
                                    // Empty div reserves space for consistency
                                    <div style={{ height: "80px" }}></div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Aura + Achievements */}
                    <div className="space-y-6">

                        {/* Aura Progress */}
                        <div className="card shadow bg-white rounded-2xl">
                            <div className="card-body">
                                <h3 className="text-lg font-semibold text-blue-600 mb-3">Aura Progress</h3>
                                <progress
                                    className="progress progress-info w-full"
                                    value={progressPercentage}
                                    max="100"
                                ></progress>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="badge badge-info badge-outline shadow-sm">
                                        Level {level}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {100 - Math.round(progressPercentage)}% to next level
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="card shadow bg-white rounded-2xl">
                            <div className="card-body">
                                <h3 className="text-lg font-semibold text-yellow-600 mb-1">Achievements</h3>

                                <div className="mt-4">
                                    {sortedAchievements && sortedAchievements.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                                            {sortedAchievements.slice(0, 5).map((ach) => (
                                                <div
                                                    key={ach._id}
                                                    className="text-sm p-1 rounded bg-yellow-100 text-yellow-800 shadow-sm"
                                                    title={ach.description}
                                                >
                                                    {ach.description}
                                                </div>
                                            ))}
                                            {sortedAchievements.length > 5 && (
                                                <Link
                                                    to="/achievements"
                                                    className="text-blue-600 text-sm mt-2 hover:underline inline-block"
                                                >
                                                    See all achievements →
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-sm text-center py-2">
                                            No achievements yet.
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="card shadow-md bg-white rounded-2xl">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                                🕒 Recent Activities
                            </h3>
                            {!hiddenActivityMsg ? (
                                recentActivities && recentActivities.length > 0 ? (
                                    <ul className="timeline timeline-vertical">
                                        {recentActivities.slice(0, 4).map((activity, index) => (
                                            <li key={activity._id} className="timeline-item flex justify-between items-start mb-6">
                                                <div className="timeline-content text-sm flex-1 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm max-w-full">
                                                    <p className="font-medium text-gray-700">{activity.message}</p>
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                                        <span className="badge badge-outline badge-sm text-pink-600 capitalize">
                                                            {activity.tag}
                                                        </span>
                                                        <span>{moment(activity.createdAt).fromNow()}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {recentActivities.length > 4 && (
                                            <Link
                                                to="/activity"
                                                className="text-blue-600 text-sm font-medium hover:underline"
                                            >
                                                See all activities →
                                            </Link>
                                        )}
                                    </ul>
                                ) : (
                                    <div className="text-gray-400 text-sm text-center py-4">
                                        No recent activity yet.
                                    </div>
                                )
                            ) : (
                                <div className="text-gray-400 text-sm text-center py-4">
                                    This user has hidden their recent activity
                                </div>
                            )}

                        </div>
                    </div>
                </div>
                {/* Edit ProfileView Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                        <div className="modal-box bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
                            <h3 className="text-2xl font-bold text-center">Edit ProfileView</h3>
                            <form onSubmit={onSubmitEditForm} className="space-y-4">
                                <input
                                    type="text"
                                    name="reg_no"
                                    value={formData.reg_no}
                                    onChange={onChangeEditForm}
                                    className="input input-bordered w-full"
                                    placeholder="Username"
                                    aria-label="Username"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChangeEditForm}
                                    className="input input-bordered w-full"
                                    placeholder="Email"
                                    aria-label="Email"
                                />
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={onChangeEditForm}
                                    className="textarea textarea-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 transition"
                                    placeholder="About"
                                    maxLength={200}
                                    aria-label="About"
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">{formData.about.length}/200</span>
                                    <div className="flex gap-2 pt-2">
                                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};


export default ProfileView;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RCRibbon from '../components/RCRibbon';
import Layout from "../components/Layout";

const RewardsChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        aura_points: '',
        end_date: '',
        invitedUsers: [],
        isPublic: false,
    });
    const [invitedUsersInput, setInvitedUsersInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewChallenge((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleInvitedUsersChange = (e) => {
        setInvitedUsersInput(e.target.value);
    };

    const proposeChallengeHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.BASE_URL}/challenges/propose`, newChallenge, { withCredentials: true });

            setShowModal(false);
            setNewChallenge({
                title: '',
                description: '',
                aura_points: '',
                end_date: '',
                invitedUsers: [],
                isPublic: false,
            });
            setInvitedUsersInput('');
            getChallenges();
            setSuccess("Challenge successfully proposed.");
        } catch (err) {
            setError(err.response?.data?.message || "Error proposing challenge.");
        }
    };

    const getChallenges = async () => {
        try {
            const res = await axios.get(`${process.env.BASE_URL}/challenges/proposed`, {
                headers: { coordinator: "true" },
                withCredentials: true,
            });
            setChallenges(res.data.challenges);
        } catch (err) {
            setError("Error fetching challenges.");
        }
    };

    useEffect(() => { getChallenges(); }, []);

    const handleInviteClick = async () => {
        try {
            const res = await axios.get(`${process.env.BASE_URL}/user/profile/${invitedUsersInput}`, { withCredentials: true });
            setNewChallenge((prev) => ({
                ...prev,
                invitedUsers: [...prev.invitedUsers, res.data.userProfile._id],
            }));
        } catch (err) {
            alert("User not found");
        }
    };

    const handleRemoveUser = (id) => {
        setNewChallenge((prev) => ({
            ...prev,
            invitedUsers: prev.invitedUsers.filter((userId) => userId !== id),
        }));
    };

    return (
        <Layout title="🏆 Rewards and Challenges">
            <div className="p-6">
                <RCRibbon />
                <div className="mt-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                        ➕ Propose Challenge
                    </button>

                    {error && <p className="mt-5 text-red-500 text-center">{error}</p>}
                    {success && <p className="mt-5 text-green-500 text-center">{success}</p>}

                    {challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {challenges.map((challenge) => (
                                <div
                                    key={challenge._id}
                                    className="p-5 bg-white shadow-lg border rounded-xl transition hover:shadow-xl"
                                >
                                    <h2 className="text-lg font-semibold text-gray-800">{challenge.title}</h2>
                                    <p className="text-sm text-gray-600 mt-2">{challenge.description}</p>

                                    <div className="mt-3 text-sm flex justify-between text-gray-500">
                                        <span>🌟 Aura Points: {challenge.aura_points}</span>
                                        <span>📅 Due: {new Date(challenge.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-6">No challenges available.</p>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 animate-fadeIn">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h3 className="text-2xl font-semibold text-gray-800">🚀 Propose a Challenge</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-red-500 transition"
                                >
                                    ✖
                                </button>
                            </div>

                            <form onSubmit={proposeChallengeHandler} className="mt-4 space-y-4">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Challenge Title"
                                    className="input input-bordered w-full"
                                    value={newChallenge.title}
                                    onChange={handleInputChange}
                                    required
                                />

                                <textarea
                                    name="description"
                                    placeholder="Challenge Description"
                                    className="textarea textarea-bordered w-full"
                                    value={newChallenge.description}
                                    onChange={handleInputChange}
                                    required
                                />

                                <input
                                    type="number"
                                    name="aura_points"
                                    placeholder="Aura Points"
                                    className="input input-bordered w-full"
                                    value={newChallenge.aura_points}
                                    onChange={handleInputChange}
                                    required
                                />

                                <input
                                    type="date"
                                    name="end_date"
                                    className="input input-bordered w-full"
                                    value={newChallenge.end_date}
                                    onChange={handleInputChange}
                                    required
                                />

                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Invite User (Reg No)"
                                        className="input input-bordered flex-grow"
                                        value={invitedUsersInput}
                                        onChange={handleInvitedUsersChange}
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                                        onClick={handleInviteClick}
                                    >
                                        Invite
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {newChallenge.invitedUsers.map((user, index) => (
                                        <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                                            {user}
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveUser(user)}
                                            >
                                                ✖
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" name="isPublic" className="checkbox" checked={newChallenge.isPublic} onChange={handleInputChange} />
                                    <span className="text-gray-600">Make this challenge public</span>
                                </label>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-800 transition"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                                    >
                                        Propose
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default RewardsChallenges;

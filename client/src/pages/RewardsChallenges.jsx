import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
        invitedUsers: [], // Stored as an array
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
            // Convert invitedUsersInput to an array
            const invitedUsersArray = invitedUsersInput
                .split(',')
                .map((id) => id.trim())
                .filter((id) => id); // Remove empty entries

            const response = await axios.post("http://localhost:5000/challenges/propose", {
                ...newChallenge,
                invitedUsers: invitedUsersArray
            }, {
                withCredentials: true
            }

            );
            console.log(response.data);
            alert("Challenge proposed successfully!");
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
        } catch (err) {
            console.error("Error proposing challenge:", err.response?.data?.message || err.message);
        }
    };

    const getChallenges = async () => {
        try {
            const res = await axios.get("http://localhost:5000/challenges/", {
                headers: {
                    coordinator: "true" // Include the required header
                },
                withCredentials: true
            })

            setChallenges(res.data.challenges);
            console.log(res.data);
        }
        catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    }

    useEffect(() => {
        getChallenges();
    }, [])

    const acceptChallengeHandler = async (challenge) => {
        try {
            const res = await axios.patch("http://localhost:5000/challenges/accept", challenge, {
                withCredentials: true
            })

            if (res.status === 200)
                setSuccess(res.data.message)

            setError(null)

            console.log(res.data)
        }
        catch (err) {
            setError(err.response.data.message)
            setSuccess(null)
            console.log("Error in acceptChallengeHandler", err.response?.data?.message || err.message)
        }
    }


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Rewards and Challenges</h1>

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Current Challenges</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="mx-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                >
                    Propose Challenge
                </button>

                <div className="mt-5 space-y-4">
                    {challenges.length > 0 ? (
                        challenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                className="p-4 border rounded-lg shadow-sm bg-gray-50"
                            >
                                <h2 className="text-lg font-semibold">{challenge.title}</h2>
                                <p className="text-sm text-gray-600">{challenge.description}</p>
                                <p className="text-sm text-gray-500">Aura Points: {challenge.aura_points}</p>
                                <p className="text-sm text-gray-500">Due Date: {new Date(challenge.end_date).toLocaleDateString()}</p>

                                <button
                                    onClick={() => acceptChallengeHandler(challenge)}
                                    className="mt-2 mx-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                                >
                                    Accept Challenge
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No challenges available.</p>
                    )}
                </div>
                {error && <p className="mt-5 text-red-500 text-center">{error}</p>}
                {success && <p className="mt-5 text-green-500 text-center">{success}</p>}
            </div>

            <div>
                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Propose Challenge</h3>

                            <form onSubmit={proposeChallengeHandler}>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Challenge Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newChallenge.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Challenge Title"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Challenge Description</label>
                                    <textarea
                                        name="description"
                                        value={newChallenge.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Challenge Description"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Aura Points</label>
                                    <input
                                        type="number"
                                        name="aura_points"
                                        value={newChallenge.aura_points}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Aura Points"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={newChallenge.end_date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Invite Users (Comma-separated User IDs)</label>
                                    <input
                                        type="text"
                                        value={invitedUsersInput}
                                        onChange={handleInvitedUsersChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="e.g., user1,user2,user3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Is Public</label>
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        checked={newChallenge.isPublic}
                                        onChange={handleInputChange}
                                        className="ml-2"
                                    />
                                    <span className="ml-2 text-gray-600">Check if the challenge is public</span>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Propose Challenge
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div >
        </div>
    );
};

export default RewardsChallenges;

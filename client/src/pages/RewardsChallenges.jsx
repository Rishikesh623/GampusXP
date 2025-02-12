import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from "../components/Layout";
import RCRibbon from '../components/RCRibbon';

const RewardsChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const dispatch = useDispatch();
    const currentChallenges = useSelector((state) => state.challengeS.challengeS);

    const getChallenges = async () => {
        try {
            const res = await axios.get(`${process.env.BASE_URL}/challenges/`, {
                headers: { coordinator: "true" },
                withCredentials: true
            });

            setChallenges(res.data.challenges);
        } catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    };

    useEffect(() => { getChallenges(); }, []);

    const acceptChallengeHandler = async (challenge) => {
        try {
            const res = await axios.patch(`${process.env.BASE_URL}/challenges/accept`, challenge, { withCredentials: true });

            if (res.status === 200) setSuccess(res.data.message);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Error accepting challenge.");
            setSuccess(null);
        }
    };

    return (
        <Layout title="🏆 Rewards and Challenges">
            <div className="p-6">
                <RCRibbon />
                <div className="mt-6">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {currentChallenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                                    <div className="mt-4">
                                        {challenge.participantDetails?.status === 'pending' ? (
                                            <button
                                                onClick={() => acceptChallengeHandler(challenge)}
                                                className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                                            >
                                                Accept Challenge
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full py-2 rounded-lg bg-green-600 text-white cursor-not-allowed"
                                                disabled
                                            >
                                                ✅ Already Accepted
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-6">No challenges available.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default RewardsChallenges;

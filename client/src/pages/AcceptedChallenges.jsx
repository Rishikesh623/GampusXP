import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChallengeS } from "../redux/challenges/challengesSlice";
import Layout from "../components/Layout";
import RCRibbon from "../components/RCRibbon";

const RewardsChallenges = () => {
    const [message, setMessage] = useState({ type: "", text: "" });
    const dispatch = useDispatch();
    const challenges = useSelector((state) => state.challengeS.challengeS);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const res = await axios.get("http://localhost:5000/challenges/accepted", {
                    headers: { coordinator: "true" },
                    withCredentials: true,
                });

                dispatch(setChallengeS(res.data.challenges));
            } catch (err) {
                console.error("Error fetching challenges:", err.response?.data?.message || err.message);
                setMessage({ type: "error", text: "Failed to load challenges." });
            }
        };

        fetchChallenges();
    }, [dispatch]);

    const completeChallengeHandler = async (challenge) => {
        try {
            const res = await axios.patch(
                "http://localhost:5000/challenges/complete",
                challenge,
                { withCredentials: true }
            );

            if (res.status === 200) {
                setMessage({ type: "success", text: res.data.message });
                dispatch(
                    setChallengeS(
                        challenges.map((ch) =>
                            ch._id === challenge._id
                                ? { ...ch, participantDetails: { status: "completed" } }
                                : ch
                        )
                    )
                );
            }
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Completion failed." });
            console.error("Error in completeChallengeHandler:", err.response?.data?.message || err.message);
        }
    };

    return (
        <Layout title="🏆 Rewards and Challenges">
            <div className="p-6">
                <RCRibbon />

                <div className="mt-6">
                    {message.text && (
                        <p className={`text-center font-medium ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                            {message.text}
                        </p>
                    )}

                    {challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {challenges.map((challenge) => {
                                const isCompleted = challenge.participantDetails?.status === "completed";

                                return (
                                    <div 
                                        key={challenge._id} 
                                        className="p-5 bg-white shadow-lg border rounded-xl transition hover:shadow-xl flex flex-col justify-between"
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{challenge.title}</h2>
                                            <p className="text-sm text-gray-600 mt-2">{challenge.description}</p>
                                            
                                            <div className="mt-3 text-sm flex justify-between text-gray-500">
                                                <span>🌟 Aura Points: {challenge.aura_points}</span>
                                                <span>📅 Due: {new Date(challenge.end_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                onClick={() => completeChallengeHandler(challenge)}
                                                className={`w-full py-2 rounded-lg font-semibold transition ${
                                                    isCompleted
                                                        ? "bg-green-500 text-white cursor-not-allowed"
                                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                                }`}
                                                disabled={isCompleted}
                                            >
                                                {isCompleted ? "✅ Completed" : "Complete"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
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

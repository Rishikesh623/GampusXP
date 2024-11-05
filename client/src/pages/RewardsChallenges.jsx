import React from 'react';

const RewardsChallenges = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Rewards and Challenges</h1>
            
            <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Complete 5 Assignments</h2>
                    <p>Reward: 200 Aura Points</p>
                    <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Start Challenge</button>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">Score 90% in Math Quiz</h2>
                    <p>Reward: 150 Aura Points</p>
                    <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Start Challenge</button>
                </div>
            </div>
        </div>
    );
};

export default RewardsChallenges;

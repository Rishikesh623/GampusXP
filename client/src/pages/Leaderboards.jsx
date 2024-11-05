import React from 'react';

const Leaderboards = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Leaderboards</h1>
            
            <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">1. Alex Johnson</h2>
                    <p>Aura Points: 1500</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">2. Maria Garcia</h2>
                    <p>Aura Points: 1400</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold">3. Chris Lee</h2>
                    <p>Aura Points: 1300</p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboards;

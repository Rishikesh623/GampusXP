import { useSelector } from 'react-redux';

const AchievementTracking = () => {
    const achievements = useSelector((state) => state.achievement.achievement);
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Achievements</h1>

            {/* Assignments List */}
            {achievements.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No achievements available.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement._id}
                            className='p-5 rounded-lg shadow-md transition-transform transform hover:scale-105 
                            bg-green-100 border border-green-500' 
                        >
                            <div className="flex justify-between items- center">
                                <h2 className="text-xl font-semibold">{achievement.description}</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                Due Date: {new Date(achievement.completionDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                Aura Points : {achievement.aura_points}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AchievementTracking;

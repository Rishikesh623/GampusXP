import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import '../style/Achievements.css';

const Achievements = () => {
  const achievements = useSelector((state) => state.achievement.achievement);

  const sortedAchievements = [...achievements].sort(
    (a, b) =>  new Date(b.completionDate) - new Date(a.completionDate)
  );

  return (
    <Layout title="🏆 Timeline of Achievements">
      <div className="overflow-x-auto py-6 px-4">
        <div className="relative flex items-center h-40 min-w-max">
          {/* Road Line */}
          <div className="absolute top-1/2 w-full road-background z-0"></div>

          {/* Achievement Cards */}
          <div className="flex gap-10 z-10 pl-10">
            {sortedAchievements.map((ach, idx) => (
              <div key={ach._id} className="relative flex flex-col items-center w-48">
                <div className="bg-white border border-green-300 shadow-md rounded-lg px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-800 text-center">
                    {ach.description}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    🌟 {ach.aura_points} pts<br />
                    📅 {new Date(ach.completionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-1 h-6 bg-green-400"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Achievements;

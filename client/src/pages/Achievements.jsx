import { useSelector } from 'react-redux';
import { useState } from "react";
import Layout from '../components/Layout';
import '../style/Achievements.css';

const Achievements = () => {
  const achievements = useSelector((state) => state.achievement.achievement);

  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.completionDate) - new Date(a.completionDate)
  );

  const CARDS_VISIBLE = 3;
  const [startIdx, setStartIdx] = useState(0);

  const canPrev = startIdx > 0;
  const canNext = startIdx + CARDS_VISIBLE < sortedAchievements.length;

  const visibleAchievements = sortedAchievements.slice(startIdx, startIdx + CARDS_VISIBLE);

  return (
    <Layout title="🏆 Timeline of Achievements">
      <div className="w-full flex justify-center items-start py-16 px-4">
        <div className="relative w-full max-w-6xl flex items-center justify-center">

          {/* Left Arrow */}
          <button
            className="absolute -left-10 top-2/3 -translate-y-1/2 z-2000 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-blue-200 disabled:opacity-40"
            onClick={() => setStartIdx(startIdx - 1)}
            disabled={!canPrev}
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Road Line */}
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-green-100 rounded-full z-0" />

          {/* Cards */}
          <div className="flex gap-12 z-100 w-full  px-6">
            {visibleAchievements.map((ach, idx) => (
              <div key={ach._id} className="relative flex flex-col items-center w-[22rem]">
                {/* Node circle */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-100">
                  <div className="w-7 h-7 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                </div>

                {/* Enhanced Glass Card */}
                <div
                  className="relative top-7 border border-white/30 shadow-xl backdrop-blur-md bg-white/30 rounded-3xl px-8 py-8 mt-8 w-full h-full text-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">
                    {ach.description}
                  </h3>

                  <p className="text-lg text-green-700 font-semibold mb-2">
                    🌟 {ach.aura_points} aura points
                  </p>

                  <p className="text-sm text-gray-700 tracking-wide">
                    📅 {new Date(ach.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>


          {/* Right Arrow */}
          <button
            className="absolute -right-10 top-2/3 -translate-y-1/2 z-200 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-blue-200 disabled:opacity-40"
            onClick={() => setStartIdx(startIdx + 1)}
            disabled={!canNext}
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Achievements;

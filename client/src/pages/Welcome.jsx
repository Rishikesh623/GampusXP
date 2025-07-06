import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [value, setValue] = useState(0);
    const target = 100;
    const duration = 4000;

    useEffect(() => {
        
        const steps = 60;
        const interval = duration / steps;
        const increment = target / steps;

        const timer = setInterval(() => {
            setValue((prev) => {
                if (prev >= target) {
                    clearInterval(timer);
                    navigate('/main');
                    return target;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 px-6 py-12 text-center relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-pink-400 rounded-full absolute animate-fall"
                        style={{
                            top: `${Math.random() * -100}px`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>


            <div className="absolute top-6 left-6 animate-bounce">
                <div className="badge badge-warning text-lg p-4 shadow-md">🏅 Aura Points +10</div>
            </div>

            <div className="absolute bottom-6 right-6 group">
                <div className="badge badge-secondary text-lg p-4 shadow-md animate-float 
                    transition-all duration-300 ease-in-out group-hover:animate-none 
                    group-hover:-translate-y-40 pointer-events-none">
                    Play
                </div>
            </div>

            {/* Hero section */}
            <div className="hero-content flex-col gap-4 animate-fadeInUp">
                <h1 className="text-5xl font-extrabold text-indigo-700">
                    Welcome to GampusXP!
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                    You’ve joined the game.<br /> Complete challenges, earn Aura Points, and <br />rule the campus
                </p>

                <div className="avatar mt-4">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-white p-2 animate-fadeInUp delay-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-purple-700" viewBox="0 0 24 24">
                            <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13L4.5 9.5V14c0 2.21 3.58 4 8 4s8-1.79 8-4v-4.5L12 15z" />
                        </svg>
                    </div>
                </div>

                <progress className="progress progress-accent w-56 mt-4 animate-pulse" value={value} max="100"></progress>
                <p className="text-sm text-gray-500 mt-2">Loading your dashboard...</p>

                <button
                    onClick={() => navigate('/main')}
                    className="btn btn-outline btn-primary mt-6 animate-fadeInUp delay-500"
                >
                    Skip →
                </button>
            </div>
        </div>
    );
}

export default Welcome;
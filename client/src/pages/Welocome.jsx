import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 text-center px-4">
      <h1 className="text-4xl font-bold mb-2 text-blue-800">🎉 Welcome Aboard!</h1>
      <p className="text-lg text-gray-700 mb-6">Your account was created successfully.</p>

      <div className="relative w-32 h-32 mb-6">
        <div className="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
        <div className="relative inline-flex rounded-full h-full w-full bg-blue-500"></div>
      </div>

      <p className="text-sm text-gray-500 mb-6">Redirecting to dashboard...</p>

      <button
        onClick={() => navigate('/')}
        className="text-sm text-blue-600 underline hover:text-blue-800 transition"
      >
        Skip →
      </button>
    </div>
  );
}

export default Welcome ;
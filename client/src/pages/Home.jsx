import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';

const Home = () => {

    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser?.reg_no) navigate('/main');
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Navbar */}
            <HomeNavBar />
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-1 text-center px-6 md:px-20">
                <div className="md:w-1/2 space-y-4 text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                        Transform Your College Experience
                    </h1>
                    <h2 className="text-5xl md:text-6xl font-bold text-primary">
                        Into an Adventure!
                    </h2>
                    <p className="text-lg text-gray-600">
                        Gamify your academic journey, track your progress, and connect with peers effortlessly.
                    </p>
                    <a href="/signup" className="btn btn-primary btn-lg">Get Started</a>
                </div>
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                    <div className="relative w-full max-w-lg h-64 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
                        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
                            <p className="text-sm font-bold text-gray-700">Aura Points: 1200</p>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
                            <p className="text-sm font-bold text-gray-700">Level: 5</p>
                        </div>
                        <div className="text-4xl font-bold text-white">Gamify Your Learning</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

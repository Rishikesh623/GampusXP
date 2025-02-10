import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentTheme = useSelector((state) => state.theme);
    const currentUser = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser?.reg_no) navigate('/main');
    }, [currentUser, navigate]);

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Navbar */}
            <nav className="navbar bg-base-100 shadow-md px-6">
                <div className="flex-1">
                    <img src="/logo.png" alt="CampusXP" className="h-20 w-auto" />
                </div>
                <div className="dropdown">
                    <button tabIndex={0} className="btn btn-ghost flex items-center gap-2">
                        Theme
                        <svg width="12px" height="12px" viewBox="0 0 2048 2048">
                            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                        </svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-xl">
                        {['light', 'retro', 'cyberpunk', 'valentine', 'aqua'].map((theme) => (
                            <li key={theme}>
                                <input
                                    type="radio"
                                    name="theme-dropdown"
                                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                    value={theme}
                                    aria-label={theme}
                                    onChange={handleThemeChange}
                                    checked={currentTheme === theme}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href="/signin">Sign In</a></li>
                        <li><a href="/signup">Sign Up</a></li>
                    </ul>
                </div>
            </nav>
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
                            <p className="text-sm font-bold text-gray-700">XP Points: 1200</p>
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

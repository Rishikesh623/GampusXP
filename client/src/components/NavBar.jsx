import { Link } from "react-router-dom";

const NavBar = ({ currentTheme,handleThemeChange,setIsNotification,profileToggle,unReadNotificationsCount,logoutHandle}) => {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md ">
            <div className="w-1/2 flex items-center">
                {/* Mobile drawer toggle button */}
                <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </label>
                <img src="/logo.png" alt="CampusXP" className="h-20 w-auto" />
            </div>

            {/* Right side header items */}
            <div className="w-1/2 flex justify-end gap-4 px-4 py-2">
                {/* Search Bar */}
                <div className='w-1/2 hidden sm:block'>
                    <label className="input input-bordered input-info input-md flex items-center gap-2 w-full max-w-lg">
                        <input type="text" className="grow focus:outline-none" placeholder="Search assignments, courses..." />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </label>
                </div>

                <div className='w-1/2 flex gap-2'>
                    {/* Theme Dropdown */}
                    <div className="w-2/4 dropdown">
                        <button tabIndex={0} className="btn w-full btn-ghost flex items-center gap-2">
                            Theme
                            <svg className="w-4 h-4" viewBox="0 0 2048 2048" fill="currentColor">
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                            </svg>
                        </button>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg w-44 p-2 shadow-xl">
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


                    {/* Notifications Icon */}

                    <button className=" indicator w-1/4  btn btn-ghost flex items-center gap-2" onClick={() => setIsNotification(true)}>
                        Inbox
                        {unReadNotificationsCount > 0 && (
                            <span className="indicator-item badge badge-secondary">{unReadNotificationsCount}</span>
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="w-1/4 dropdown flex justify-end">
                        <button tabIndex={0} className="flex items-center space-x-2 focus:outline-none" onClick={profileToggle}>
                            <img src="/profile_picture.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                        </button>

                        <ul tabIndex={0} className="dropdown-content absolute right-0 mt-12 bg-base-100 rounded-lg w-52 p-2 shadow-xl border border-gray-200">
                            <li>
                                <Link to="/profile" className="block w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="block w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link to="/signin" onClick={logoutHandle} className="block w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default NavBar;

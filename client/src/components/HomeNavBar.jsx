import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme/themeSlice';

const HomeNavBar = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme);

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    };

    return (
        <>
            <nav className="navbar bg-base-100 shadow-md px-6">
                <div className="flex-1">
                    <img src="/logo.png" alt="GampusXP" className="h-20 w-auto" />
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
        </>
    )
}

export default HomeNavBar;
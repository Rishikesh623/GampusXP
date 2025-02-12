import { Link } from "react-router-dom";

const LeftDrawer = ({ title }) => {
    const menuItems = [
        { path: "/", label: "Dashboard" },
        { path: "/course-management-user", label: "Course Management" },
        { path: "/assignment-tracking", label: "Assignment Tracking" },
        { path: "/leaderboards", label: "Leaderboards" },
        { path: "/rewards-challenges", label: "Rewards and Challenges" },
        { path: "/timetable", label: "Timetable" },
        { path: "/settings", label: "Settings" }
    ];

    return (
        <>
            {/* Drawer Side (Left Navigation Menu) */}
            <div className="drawer-side">
                <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
                <aside className="w-64 h-screen bg-white border-r p-4">
                    <nav className="mt-6">
                        <ul className="space-y-2">
                            {menuItems.map(({ path, label }) => (
                                <li key={path} className={`px-4 py-2 rounded font-semibold 
                                    ${title === label ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50 cursor-pointer"}`}>
                                    <Link to={path}>{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default LeftDrawer;

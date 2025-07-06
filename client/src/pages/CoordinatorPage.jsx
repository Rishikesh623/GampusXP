import { Link } from "react-router-dom";

const CoordinatorPage = () => {
    const coordinatorTools = [
        { path: "/coordinator/course-management", label: "📚 Manage Courses" },
        { path: "/coordinator/challenges-management", label: "🎯 Manage Challenges" },
    ];

    const mainUILinks = [
        { path: "/main", label: "🏠 Main User Home" },
        { path: "/profile", label: "👤 Your Profile" },
        { path: "/other-user-profile", label: "👥 Other User Profile" },
        { path: "/course-management-user", label: "📘 User Course Page" },
        { path: "/assignment-tracking", label: "📝 Assignment Tracking" },
        { path: "/achievement-tracking", label: "🏆 Achievement Tracking" },
        { path: "/leaderboards", label: "📊 Leaderboards" },
        { path: "/rewards-challenges", label: "🎁 Rewards & Challenges" },
        { path: "/proposed-challenges", label: "🧪 Proposed Challenges" },
        { path: "/accepted-challenges", label: "✅ Accepted Challenges" },
        { path: "/timetable", label: "📅 Timetable" },
        { path: "/settings", label: "⚙️ Settings" },
        { path: "/", label: "🌐 Public Home Page" },
    ];

    return (
        <div data-theme="light" className="min-h-screen bg-base-100 px-8 py-6 space-y-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded">
                    <img src="/logo.png" alt="GampusXP" className="h-16 w-auto" />
                </div>
                <h1 className="text-3xl font-semibold">Coordinator Dashboard</h1>
            </div>

            {/* Coordinator Tools */}
            <section>
                <h2 className="text-2xl font-medium mb-2">Coordinator Tools</h2>
                <p className="text-sm text-gray-600 mb-4">Manage platform content and challenges</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {coordinatorTools.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className="btn btn-outline justify-start w-full"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Main App UI Links */}
            <section>
                <h2 className="text-2xl font-medium mb-2">Main App UI Access</h2>
                <p className="text-sm text-gray-600 mb-4">View how users see various sections</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {mainUILinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className="btn btn-outline justify-start w-full"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CoordinatorPage;

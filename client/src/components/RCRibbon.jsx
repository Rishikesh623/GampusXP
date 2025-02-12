import { useNavigate, useLocation } from "react-router-dom";

const RCRibbon = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: "/rewards-challenges", label: "Public Challenges" },
        { path: "/proposed-challenges", label: "Proposed Challenges" },
        { path: "/accepted-challenges", label: "Accepted Challenges" }
    ];

    return (
        <div className="flex items-center justify-center space-x-8 border-b">
            {tabs.map(({ path, label }) => (
                <div 
                    key={path} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate(path)}
                >
                    <span className={`text-lg font-semibold transition-colors ${
                        location.pathname === path 
                            ? "text-black" 
                            : "text-gray-500 hover:text-gray-700"
                    }`}>
                        {label}
                    </span>
                    <div className={`h-1 w-full mt-1 transition-all ${
                        location.pathname === path 
                            ? "bg-black w-3/4" 
                            : "bg-transparent"
                    }`}></div>
                </div>
            ))}
        </div>
    );
};

export default RCRibbon;

import React, { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ICONS = {
    assignment: "📄",
    course: "📚",
    challenge: "🏆",
    user: "👤",
};

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const timeoutRef = useRef();

    // Debounced search
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (!value.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_BASE_URL}/api/search?q=${encodeURIComponent(value)}`,
                    { withCredentials: true }
                );
                setResults(res.data.results || []);
                setShowDropdown(true);
            } catch (err) {
                setResults([]);
                setShowDropdown(false);
            }
            setLoading(false);
        }, 400);
    };

    const wrapperRef = useRef();
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const highlight = (text) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "ig");
        return text.split(regex).map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="bg-yellow-200 rounded">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={wrapperRef}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                className="w-full"
                placeholder="Search mates, assignments, challenges..."
                onFocus={() => { if (results.length) setShowDropdown(true); }}
            />
            
            {showDropdown && (
                <div className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-2xl z-10 max-h-80 overflow-auto">
                    {results.length > 0 ? (
                        <ul>
                            {results.map((item) => (
                                <li
                                    key={item._id + item._type}
                                    className="px-4 py-2 hover:bg-blue-50 flex justify-between items-center transition-colors group"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{ICONS[item._type] || "🔎"}</span>
                                        {item._type === "user" ? (
                                            <Link
                                                to={`/profile/u/${item.reg_no}`}
                                                state={{ reg_no: item.reg_no }}
                                                className="text-blue-600 hover:underline font-medium"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                {highlight(item.name)}
                                            </Link>
                                        ) : (
                                            <span className="font-medium">
                                                {highlight(item.title || item.name || item.email)}
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{item._type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-gray-400 text-center">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

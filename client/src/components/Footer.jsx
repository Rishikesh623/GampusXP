// components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-auto">
            <hr className="border-t border-gray-200  my-5" />
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} GampusXP. All rights reserved.</p>
                <nav className="mt-1 space-x-4">
                    <Link to="/help" className="hover:underline">❓ Help</Link>
                    <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                    <Link to="/terms" className="hover:underline">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;

import React from "react";
import LeftDrawer from "./LeftDrawer";
import Footer from "./Footer";

const Layout = ({ children, title, screenHeight = false, additionalHeaderElement }) => {
    const cleanTitle = (title) => title.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    return (
        <div className="drawer">
            {/* Drawer Toggle Checkbox */}
            <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

            {/* Main Content */}
            <div className={screenHeight ? 'drawer-content p-6 bg-gray-100 h-screen' : 'drawer-content p-6 bg-gray-100 min-h-screen'}>
                <div className="grid grid-cols-3 items-center mb-6">
                    <div className="flex items-center">
                        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-3xl font-black text-primary text-center">{title}</h1>
                    <div className="flex justify-end">
                        {additionalHeaderElement}
                    </div>
                </div>

                <div>{children}</div>
                <Footer/>
            </div>

            {/* Left Drawer */}
            <LeftDrawer title={cleanTitle(title)} />
        </div>
    );
};

export default Layout;
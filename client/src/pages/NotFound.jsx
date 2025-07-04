import HomeNavBar from "../components/HomeNavBar";

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen bg-base-200 flex flex-col">
                {/* Navbar */}
                <HomeNavBar />
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-center flex-1 text-center px-6 md:px-20">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-7xl font-extrabold text-error mb-2">404</h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Oops! This page is lost in campus space
                        </p>

                        <div className="mb-6">
                            <div className="badge badge-outline badge-error text-sm px-4 py-2">
                                Looks like you skipped a class that doesn't exist!
                            </div>
                        </div>

                        <a href="/" className="btn btn-primary btn-wide"> Go Back Home</a>
                    </div>
                </div>
            </div>
        </>
    );
}

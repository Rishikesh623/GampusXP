
const OverlayLoader = ({ loading, children }) => {
    return (
        <div className="relative">
            {loading &&
                <div className={`fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50`}>
                    <span className={`loading loading-spinner text-primary w-12 h-12`}></span>
                </div>
            }
            {children}
        </div>
    );
};

export default OverlayLoader;

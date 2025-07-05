import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = ({ message, type = 'info', duration = 3000 }) => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast UI */}
            {toast && (
                <div className="toast toast-top toast-end">
                    <div className = {`alert alert-${toast.type}  duration-300`} >
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

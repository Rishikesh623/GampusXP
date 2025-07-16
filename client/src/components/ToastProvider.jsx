import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = ({ message, type = 'info', duration = 2000 }) => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, duration);
    };

    const getAlertClass = (type) => {
        switch (type) {
            case "success":
                return "alert alert-success";
            case "error":
                return "alert alert-error";
            case "warning":
                return "alert alert-warning";
            case "info":
                return "alert alert-info";
            default:
                return "alert";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast UI */}
            {toast && (
                <div className="toast toast-top toast-end">
                    <div className={`${getAlertClass(toast.type)}  duration-300`} >
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

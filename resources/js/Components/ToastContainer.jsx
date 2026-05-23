import { useState, useCallback } from "react";
import Toast from "./Toast";

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <>
            {/* Render toasts in top-right fixed container */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
            {/* Expose addToast via context or window? We'll use a React context */}
            <ToastContext.Provider value={{ addToast }}>
                {/* children will be rendered by layout */}
            </ToastContext.Provider>
        </>
    );
}

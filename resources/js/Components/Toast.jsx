import {
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamationCircle,
    HiOutlineX,
} from "react-icons/hi";
import { useEffect, useState } from "react";

const variantStyles = {
    success: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-l-green-500 dark:border-l-green-400",
        icon: HiOutlineCheckCircle,
        text: "text-green-700 dark:text-green-400",
        progress: "bg-green-500",
    },
    error: {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-l-red-500 dark:border-l-red-400",
        icon: HiOutlineXCircle,
        text: "text-red-700 dark:text-red-400",
        progress: "bg-red-500",
    },
    warning: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-l-yellow-500 dark:border-l-yellow-400",
        icon: HiOutlineExclamationCircle,
        text: "text-yellow-700 dark:text-yellow-400",
        progress: "bg-yellow-500",
    },
    info: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-l-blue-500 dark:border-l-blue-400",
        icon: HiOutlineInformationCircle,
        text: "text-blue-700 dark:text-blue-400",
        progress: "bg-blue-500",
    },
};

export default function Toast({
    id,
    message,
    type = "success",
    onClose,
    duration = 4000,
}) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - 100 / (duration / 50)));
        }, 50);
        const timeout = setTimeout(() => onClose(id), duration);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [id, duration, onClose]);

    const Icon = variantStyles[type].icon;
    const styles = variantStyles[type];

    return (
        <div className="relative w-full max-w-sm mb-3 animate-slide-in-right">
            {/* Main toast card */}
            <div
                className={`flex items-start p-4 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 ${styles.bg} ${styles.border} border-l-4 backdrop-blur-sm`}
                role="alert"
            >
                <div className="shrink-0">
                    <Icon className={`w-6 h-6 ${styles.text}`} />
                </div>
                <div className="ml-3 flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {message}
                </div>
                <button
                    type="button"
                    onClick={() => onClose(id)}
                    className="ml-4 shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close"
                >
                    <HiOutlineX className="w-5 h-5" />
                </button>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                <div
                    className={`h-full ${styles.progress} transition-all duration-50 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

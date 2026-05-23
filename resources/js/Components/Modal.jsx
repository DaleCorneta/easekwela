import { Fragment } from "react";
import {
    HiOutlineExclamation,
    HiOutlineTrash,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
} from "react-icons/hi";

const iconMap = {
    danger: HiOutlineTrash,
    warning: HiOutlineExclamation,
    info: HiOutlineInformationCircle,
    success: HiOutlineCheckCircle,
};

const variantStyles = {
    danger: {
        bg: "bg-red-100 dark:bg-red-900/30",
        icon: "text-red-600 dark:text-red-400",
        button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        icon: "text-yellow-600 dark:text-yellow-400",
        button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    },
    info: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        icon: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
    success: {
        bg: "bg-green-100 dark:bg-green-900/30",
        icon: "text-green-600 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
};

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger", // danger, warning, info, success
    showCancel = true,
}) {
    if (!isOpen) return null;

    const Icon = iconMap[variant] || HiOutlineExclamation;
    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                {/* Blur backdrop */}
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                    <div className="px-6 py-5">
                        <div className="flex items-start gap-4">
                            <div
                                className={`shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.bg}`}
                            >
                                <Icon className={`h-6 w-6 ${styles.icon}`} />
                            </div>
                            <div>
                                <h3
                                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                                    id="modal-title"
                                >
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 flex flex-row-reverse gap-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 ${styles.button}`}
                        >
                            {confirmText}
                        </button>
                        {showCancel && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

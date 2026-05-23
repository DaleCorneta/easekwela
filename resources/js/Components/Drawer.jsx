import { HiOutlineX } from "react-icons/hi";

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    width = "w-96",
}) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with blur – no click to close */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-screen ${width} p-4 overflow-y-auto transition-transform duration-300 transform translate-x-0 bg-neutral-primary-soft dark:bg-gray-800 shadow-xl`}
            >
                <div className="border-b border-default dark:border-gray-700 pb-4 mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-medium text-body dark:text-white">
                        {title}
                    </h5>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-body bg-transparent hover:text-heading hover:bg-neutral-tertiary dark:hover:bg-gray-700 rounded-base w-9 h-9 flex items-center justify-center"
                    >
                        <HiOutlineX className="w-5 h-5" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {children}
            </div>
        </>
    );
}

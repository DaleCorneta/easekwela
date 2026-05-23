export default function Toggle({ checked, onChange, disabled = false }) {
    return (
        <button
            type="button"
            onClick={disabled ? undefined : onChange}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    checked ? "translate-x-4" : "translate-x-0"
                }`}
            />
        </button>
    );
}

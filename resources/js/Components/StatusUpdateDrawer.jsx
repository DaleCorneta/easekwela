import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function StatusUpdateDrawer({ student, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        status: "",
        effective_date: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    useEffect(() => {
        return () => reset();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("students.update-status", student.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const statuses = [
        "active",
        "inactive",
        "graduated",
        "transferred",
        "dropped",
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    New Status *
                </label>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                >
                    <option value="">Select Status</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
                {errors.status && (
                    <p className="text-red-600 text-sm mt-1">{errors.status}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Effective Date *
                </label>
                <input
                    type="date"
                    value={data.effective_date}
                    onChange={(e) => setData("effective_date", e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                />
                {errors.effective_date && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.effective_date}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-body dark:text-gray-300 mb-1">
                    Remarks
                </label>
                <textarea
                    value={data.remarks}
                    onChange={(e) => setData("remarks", e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 bg-neutral-secondary-medium dark:bg-gray-700 border border-default-medium dark:border-gray-600 rounded-base text-heading dark:text-white focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.remarks && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.remarks}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-default dark:border-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={processing}
                    className="px-4 py-2 bg-neutral-secondary-medium border border-default-medium text-body rounded-base hover:bg-neutral-tertiary-medium hover:text-heading transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-primary text-white rounded-base hover:bg-primary-dark disabled:opacity-50 transition shadow-sm"
                >
                    Update Status
                </button>
            </div>
        </form>
    );
}
